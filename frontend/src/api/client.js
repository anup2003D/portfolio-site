const BASE_URL = '/api';

async function request(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Request failed: ${response.status}`);
  }
  return response.json();
}

export const api = {
  getPortfolio: () => request('/portfolio'),
  updatePortfolio: (data) =>
    request('/portfolio', { method: 'PUT', body: JSON.stringify(data) }),

  getProjects: (category) =>
    request(`/projects${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  getProject: (id) => request(`/projects/${id}`),
  createProject: (data) =>
    request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id, data) =>
    request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id) =>
    request(`/projects/${id}`, { method: 'DELETE' }),

  getExperiences: () => request('/experiences'),
  createExperience: (data) =>
    request('/experiences', { method: 'POST', body: JSON.stringify(data) }),
  updateExperience: (id, data) =>
    request(`/experiences/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExperience: (id) =>
    request(`/experiences/${id}`, { method: 'DELETE' }),

  getSkills: () => request('/skills'),
  updateSkills: (category, data) =>
    request(`/skills/${category}`, { method: 'PUT', body: JSON.stringify(data) }),

  submitContact: (data) =>
    request('/contact', { method: 'POST', body: JSON.stringify(data) }),
  getMessages: () => request('/contact/messages'),
  markMessageRead: (id) =>
    request(`/contact/messages/${id}/read`, { method: 'PUT' }),
};
