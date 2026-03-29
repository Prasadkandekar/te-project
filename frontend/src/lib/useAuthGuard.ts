import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

/**
 * Returns { user, ready }
 * With redux-persist, user is rehydrated synchronously before render.
 */
export function useAuthGuard() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  return { user, ready: true, isAuthenticated }
}
