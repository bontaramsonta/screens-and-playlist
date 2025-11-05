import type {
  ApiError,
  CreatePlaylistRequest,
  CreatePlaylistResponse,
  LoginRequest,
  LoginResponse,
  PaginatedResponse,
  PaginationParams,
  Playlist,
  Screen,
  UpdateScreenRequest,
  UpdateScreenResponse,
} from '../types'

// API base URL from environment
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// API Error class for better error handling
export class ApiErrorClass extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Token storage utilities
export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  },

  set: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem('auth_token', token)
  },

  remove: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('auth_token')
  },
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = tokenStorage.get()

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    // Handle different response statuses
    if (response.status === 401) {
      // Unauthorized - clear token and redirect to login
      tokenStorage.remove()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new ApiErrorClass('Unauthorized', 401)
    }

    const data = await response.json()

    if (!response.ok) {
      const errorMessage = (data as ApiError).error || 'An error occurred'
      throw new ApiErrorClass(errorMessage, response.status)
    }

    return data as T
  } catch (error) {
    if (error instanceof ApiErrorClass) {
      throw error
    }
    // Network or other errors
    throw new ApiErrorClass('Network error or server unavailable', 0)
  }
}

// Authentication API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    // Store token after successful login
    tokenStorage.set(response.token)
    return response
  },

  logout: (): void => {
    tokenStorage.remove()
  },
}

// Screens API
export const screensApi = {
  getScreens: async (
    params: PaginationParams = {},
  ): Promise<PaginatedResponse<Screen>> => {
    const searchParams = new URLSearchParams()

    if (params.search) searchParams.append('search', params.search)
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())

    const queryString = searchParams.toString()
    const endpoint = `/screens${queryString ? `?${queryString}` : ''}`

    return apiRequest<PaginatedResponse<Screen>>(endpoint)
  },

  updateScreen: async (
    id: string,
    data: UpdateScreenRequest,
  ): Promise<UpdateScreenResponse> => {
    return apiRequest<UpdateScreenResponse>(`/screens/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
}

// Playlists API
export const playlistsApi = {
  getPlaylists: async (
    params: PaginationParams = {},
  ): Promise<PaginatedResponse<Playlist>> => {
    const searchParams = new URLSearchParams()

    if (params.search) searchParams.append('search', params.search)
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())

    const queryString = searchParams.toString()
    const endpoint = `/playlists${queryString ? `?${queryString}` : ''}`

    return apiRequest<PaginatedResponse<Playlist>>(endpoint)
  },

  createPlaylist: async (
    data: CreatePlaylistRequest,
  ): Promise<CreatePlaylistResponse> => {
    return apiRequest<CreatePlaylistResponse>('/playlists', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// Export combined API object
export const api = {
  auth: authApi,
  screens: screensApi,
  playlists: playlistsApi,
}
