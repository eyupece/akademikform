"""
Google Gemini AI Service
Akademik metin üretimi ve iyileştirme servisi
"""

import os
from typing import Optional
import google.generativeai as genai
from config.settings import settings


# Gemini API'yi yapılandır
def get_available_model():
    """
    Mevcut modelleri kontrol eder ve uygun bir model döndürür
    Free tier için en uygun modeli seçer
    """
    try:
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        
        # Önce mevcut modelleri listele
        try:
            models = genai.list_models()
            available_models = [m.name for m in models if 'generateContent' in m.supported_generation_methods]
            
            # Öncelik sırası (free tier için en uygun modeller):
            # 1. gemini-2.5-flash (stable, 1M token, 65K output) - EN İYİ
            # 2. gemini-2.0-flash-001 (stable, 1M token, 8K output)
            # 3. gemini-flash-latest (latest, 1M token, 65K output)
            # 4. gemini-2.0-flash (stable)
            preferred_models = [
                'models/gemini-2.5-flash',           # En iyi: Stable, yüksek limit
                'models/gemini-2.0-flash-001',      # İyi: Stable, orta limit
                'models/gemini-flash-latest',        # İyi: Latest, yüksek limit
                'models/gemini-2.0-flash',          # Alternatif
                'models/gemini-2.5-flash-lite',     # Hafif versiyon
            ]
            
            for preferred in preferred_models:
                # Model adını kontrol et
                if preferred in available_models:
                    print(f"✅ Kullanılan model: {preferred}")
                    return genai.GenerativeModel(preferred)
            
            # Eğer hiçbiri bulunamazsa, ilk uygun modeli kullan
            if available_models:
                model_name = available_models[0]
                print(f"✅ Kullanılan model (ilk bulunan): {model_name}")
                return genai.GenerativeModel(model_name)
            
        except Exception as list_error:
            print(f"⚠️ Model listesi alınamadı: {list_error}")
        
        # Fallback: Direkt model adı ile dene (en stabil)
        print("⚠️ Model listesi alınamadı, fallback model kullanılıyor: models/gemini-2.5-flash")
        return genai.GenerativeModel('models/gemini-2.5-flash')
        
    except Exception as e:
        print(f"⚠️ Gemini API yapılandırılamadı: {e}")
        return None

# Model'i başlat
model = get_available_model()


def build_generate_prompt(
    draft_content: str,
    section_title: str,
    project_title: str,
    style: str,
    min_words: int = 0,
    max_words: int = 0,
    additional_instructions: str = ""
) -> str:
    """
    AI metin üretimi için prompt oluşturur
    
    Args:
        draft_content: Kullanıcının taslak metni
        section_title: Bölüm başlığı
        project_title: Proje başlığı
        style: Yazım stili
        min_words: Minimum kelime sayısı
        max_words: Maximum kelime sayısı
        additional_instructions: Ek talimatlar
        
    Returns:
        str: Hazırlanmış prompt
    """
    prompt = f"""Sen akademik metin yazma konusunda uzman bir asistansın. Kullanıcının taslak metnini akademik, bilimsel ve profesyonel bir dile dönüştür.

**CONTEXT:**
- Proje Başlığı: {project_title}
- Bölüm: {section_title}
- Stil: {style}
- Min Kelime: {min_words if min_words > 0 else 'Belirtilmemiş'}
- Max Kelime: {max_words if max_words > 0 else 'Belirtilmemiş'}

**TASK:**
Aşağıdaki taslak metni akademik dile çevir, geliştir ve iyileştir:

{draft_content}

"""

    if additional_instructions:
        prompt += f"\n**EK TALİMATLAR:**\n{additional_instructions}\n"

    prompt += """
**ÖNEMLİ KURALLAR:**
1. Metni Türkçe yaz (eğer taslak Türkçeyse)
2. Akademik, bilimsel ve profesyonel bir dil kullan
3. Gereksiz tekrarlardan kaçın
4. Net, anlaşılır ve akıcı yaz
5. Kelime sayısı limitlerini dikkate al
6. Sadece metni döndür, açıklama veya başlık ekleme
"""
    
    return prompt


def build_revise_prompt(
    current_content: str,
    revision_prompt: str,
    section_title: str,
    project_title: str,
    style: str,
    min_words: int = 0,
    max_words: int = 0
) -> str:
    """
    AI metin revizyonu için prompt oluşturur
    
    Args:
        current_content: Mevcut AI önerisi
        revision_prompt: Kullanıcının revizyon talimatı
        section_title: Bölüm başlığı
        project_title: Proje başlığı
        style: Yazım stili
        min_words: Minimum kelime sayısı
        max_words: Maximum kelime sayısı
        
    Returns:
        str: Hazırlanmış prompt
    """
    prompt = f"""Sen akademik metin yazma konusunda uzman bir asistansın. Kullanıcı tarafından verilen talimatlar doğrultusunda metni revize et.

**CONTEXT:**
- Proje Başlığı: {project_title}
- Bölüm: {section_title}
- Stil: {style}
- Min Kelime: {min_words if min_words > 0 else 'Belirtilmemiş'}
- Max Kelime: {max_words if max_words > 0 else 'Belirtilmemiş'}

**MEVCUT METİN:**
{current_content}

**REVİZYON TALİMATI:**
{revision_prompt}

**ÖNEMLİ KURALLAR:**
1. Sadece istenen değişiklikleri yap
2. Metni Türkçe yaz (eğer orijinal Türkçeyse)
3. Akademik, bilimsel ve profesyonel bir dil kullan
4. Kelime sayısı limitlerini dikkate al
5. Sadece metni döndür, açıklama veya başlık ekleme
"""
    
    return prompt


async def generate_text(
    draft_content: str,
    section_title: str,
    project_title: str,
    style: str = "Akademik, bilimsel ve profesyonel",
    min_words: int = 0,
    max_words: int = 0,
    additional_instructions: str = ""
) -> dict:
    """
    AI ile metin üretir
    
    Args:
        draft_content: Kullanıcının taslak metni
        section_title: Bölüm başlığı
        project_title: Proje başlığı
        style: Yazım stili
        min_words: Minimum kelime sayısı
        max_words: Maximum kelime sayısı
        additional_instructions: Ek talimatlar
        
    Returns:
        dict: {"generated_content": str} veya hata
        
    Raises:
        Exception: API hatası durumunda
    """
    if not model:
        raise Exception("Gemini API yapılandırılmamış. GOOGLE_API_KEY environment variable'ını kontrol edin.")
    
    try:
        # Prompt oluştur
        prompt = build_generate_prompt(
            draft_content=draft_content,
            section_title=section_title,
            project_title=project_title,
            style=style,
            min_words=min_words,
            max_words=max_words,
            additional_instructions=additional_instructions
        )
        
        # Gemini API'yi çağır
        response = model.generate_content(prompt)
        
        # Yanıtı işle
        generated_text = response.text.strip()
        
        # Post-processing
        generated_text = post_process_text(generated_text)
        
        return {
            "generated_content": generated_text
        }
        
    except Exception as e:
        raise Exception(f"Gemini API hatası: {str(e)}")


async def revise_text(
    current_content: str,
    revision_prompt: str,
    section_title: str,
    project_title: str,
    style: str = "Akademik, bilimsel ve profesyonel",
    min_words: int = 0,
    max_words: int = 0
) -> dict:
    """
    Mevcut AI önerisini kullanıcı talimatıyla revize eder
    
    Args:
        current_content: Mevcut AI önerisi
        revision_prompt: Kullanıcının revizyon talimatı
        section_title: Bölüm başlığı
        project_title: Proje başlığı
        style: Yazım stili
        min_words: Minimum kelime sayısı
        max_words: Maximum kelime sayısı
        
    Returns:
        dict: {"generated_content": str} veya hata
        
    Raises:
        Exception: API hatası durumunda
    """
    if not model:
        raise Exception("Gemini API yapılandırılmamış. GOOGLE_API_KEY environment variable'ını kontrol edin.")
    
    try:
        # Prompt oluştur
        prompt = build_revise_prompt(
            current_content=current_content,
            revision_prompt=revision_prompt,
            section_title=section_title,
            project_title=project_title,
            style=style,
            min_words=min_words,
            max_words=max_words
        )
        
        # Gemini API'yi çağır
        response = model.generate_content(prompt)
        
        # Yanıtı işle
        generated_text = response.text.strip()
        
        # Post-processing
        generated_text = post_process_text(generated_text)
        
        return {
            "generated_content": generated_text
        }
        
    except Exception as e:
        raise Exception(f"Gemini API hatası: {str(e)}")


def post_process_text(text: str) -> str:
    """
    AI tarafından üretilen metni temizler ve düzenler
    
    Args:
        text: İşlenecek metin
        
    Returns:
        str: Temizlenmiş metin
    """
    # Gereksiz boşlukları kaldır
    text = " ".join(text.split())
    
    # Markdown/HTML etiketlerini kaldır (basit)
    text = text.replace("**", "").replace("__", "").replace("##", "")
    
    # Başlangıç/bitiş boşluklarını temizle
    text = text.strip()
    
    return text


def count_words(text: str) -> int:
    """
    Metindeki kelime sayısını hesaplar
    
    Args:
        text: Sayılacak metin
        
    Returns:
        int: Kelime sayısı
    """
    return len(text.split())


def check_word_limit(text: str, min_words: int, max_words: int) -> dict:
    """
    Metnin kelime sayısı limitlerini kontrol eder
    
    Args:
        text: Kontrol edilecek metin
        min_words: Minimum kelime sayısı
        max_words: Maximum kelime sayısı
        
    Returns:
        dict: {"valid": bool, "word_count": int, "message": str}
    """
    word_count = count_words(text)
    
    if min_words > 0 and word_count < min_words:
        return {
            "valid": False,
            "word_count": word_count,
            "message": f"Metin çok kısa. En az {min_words} kelime olmalı (şu an: {word_count})"
        }
    
    if max_words > 0 and word_count > max_words:
        return {
            "valid": False,
            "word_count": word_count,
            "message": f"Metin çok uzun. En fazla {max_words} kelime olmalı (şu an: {word_count})"
        }
    
    return {
        "valid": True,
        "word_count": word_count,
        "message": "OK"
    }

