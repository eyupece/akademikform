/**
 * API Client - Gerçek Backend'e Bağlantı
 * Bu dosya FastAPI backend'ine HTTP istekleri gönderir
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// ========================================
// HELPER FUNCTIONS
// ========================================

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      error: 'unknown_error', 
      message: `HTTP ${response.status}: ${response.statusText}` 
    }));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
}

async function get<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<T>(response);
}

async function post<T>(endpoint: string, data?: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  return handleResponse<T>(response);
}

async function patch<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

async function del<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<T>(response);
}

// ========================================
// API CLIENT
// ========================================

const apiClient = {
  // ========================================
  // AUTH
  // ========================================
  auth: {
    register: async (email: string, password: string, fullName: string) => {
      return post('/auth/register', { email, password, full_name: fullName });
    },

    login: async (email: string, password: string) => {
      return post('/auth/login', { email, password });
    },

    forgotPassword: async (email: string) => {
      return post('/auth/forgot-password', { email });
    },
  },

  // ========================================
  // TEMPLATES
  // ========================================
  templates: {
    getAll: async () => {
      return get('/templates');
    },

    getById: async (id: string) => {
      return get(`/templates/${id}`);
    },
  },

  // ========================================
  // PROJECTS
  // ========================================
  projects: {
    getAll: async (page = 1, limit = 20) => {
      return get(`/projects?page=${page}&limit=${limit}`);
    },

    getById: async (id: string) => {
      return get(`/projects/${id}`);
    },

    create: async (data: { template_id: string; title: string }) => {
      return post('/projects/', data); // Trailing slash eklendi
    },

    updateTitle: async (id: string, title: string) => {
      return patch(`/projects/${id}`, { title });
    },

    updateGeneralInfo: async (id: string, data: any) => {
      return patch(`/projects/${id}/general-info`, data);
    },

    updateKeywords: async (id: string, keywords: string) => {
      return patch(`/projects/${id}/keywords`, { keywords });
    },

    updateScientificMerit: async (id: string, data: any) => {
      return patch(`/projects/${id}/scientific-merit`, data);
    },

    updateProjectManagement: async (id: string, data: any) => {
      return patch(`/projects/${id}/project-management`, data);
    },

    updateWideImpact: async (id: string, data: any) => {
      return patch(`/projects/${id}/wide-impact`, data);
    },

    delete: async (id: string) => {
      return del(`/projects/${id}`);
    },
  },

  // ========================================
  // SECTIONS
  // ========================================
  sections: {
    update: async (id: string, draftContent: string) => {
      return patch(`/sections/${id}`, { draft_content: draftContent });
    },

    generate: async (id: string, data: { 
      draft_content: string; 
      style: string; 
      additional_instructions?: string 
    }) => {
      return post(`/sections/${id}/generate`, data);
    },

    revise: async (id: string, data: { 
      current_content: string; 
      revision_prompt: string; 
      style: string 
    }) => {
      return post(`/sections/${id}/revise`, data);
    },

    accept: async (id: string, content: string) => {
      return post(`/sections/${id}/accept`, { content });
    },

    getRevisions: async (id: string) => {
      return get(`/sections/${id}/revisions`);
    },
  },

  // ========================================
  // GENERIC AI (Section'dan bağımsız)
  // ========================================
  ai: {
    generate: async (data: {
      content: string;
      style: string;
      additional_instructions?: string;
      context?: {
        field_type?: string;
        category?: string;
        project_id?: string;
        [key: string]: any;
      };
    }) => {
      return post('/ai/generate', data);
    },

    revise: async (data: {
      current_content: string;
      revision_prompt: string;
      style: string;
      context?: {
        field_type?: string;
        category?: string;
        project_id?: string;
        [key: string]: any;
      };
    }) => {
      return post('/ai/revise', data);
    },
  },

  // ========================================
  // EXPORT
  // ========================================
  export: {
    exportProject: async (projectId: string, format: 'docx' | 'pdf') => {
      return post('/export', { project_id: projectId, format });
    },
  },

  // ========================================
  // DEBUG
  // ========================================
  debug: {
    getModels: async () => {
      return get('/debug/models');
    },
  },
};

export default apiClient;




