import { toast } from 'react-hot-toast'

export const copyToClipboard = (
  textToCopy: string,
  successMessage: string,
  errorMessage: string,
  setCopied?: (value: boolean) => void
) => {
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      setCopied?.(true)
      toast.success(successMessage)
      setTimeout(() => setCopied?.(false), 2000)
    })
    .catch(() => {
      toast.error(errorMessage)
    })
}
