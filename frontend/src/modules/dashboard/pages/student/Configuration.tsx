import { Button } from '../../../../shared/components/ui'
import { authStore } from '../../../../shared/store/authStore'

export const Configuration = () => {
  const handleGithubConnect = () => {
    const token = authStore.token || ''
    const encodedToken = encodeURIComponent(token)
    const url = `${import.meta.env.VITE_API_URL}/api/github/authorize?state=${encodedToken}`
    window.location.href = url
  }

  return (
    <div>
      <h2>Configuración</h2>
      <Button onClick={handleGithubConnect} variant="primary">
        Conectar con Github
      </Button>
    </div>
  )
}
