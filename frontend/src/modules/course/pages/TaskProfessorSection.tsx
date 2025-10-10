import { ProjectCard } from '../components/ProjectCard'
import { ProjectSubmissionsView } from '../components/ProjectSubmissionsView'
import { SubmissionHistoryModal } from '../components/SubmissionHistoryModal'
import { EmptyState } from '../../../shared/components/ui/EmptyState'
import { Skeleton } from '../../../shared/components/ui/Skeleton'
import { useTaskProfessorData } from '../hooks/useTaskProfessorData'

export const TaskProfessorSection = ({ courseId }: { courseId: number }) => {
  const courseIdNum = Number(courseId)

  const {
    projects,
    students,
    submissionsByProject,
    selectedProject,
    setSelectedProject,
    selectedSubmissionForModal,
    selectedSubmissionDetails,
    versions,
    loading,
    error,
    loadingSubmissions,
    errorSubmissions,
    fetchSubmissionsForProject,
    openVersionsModal,
    closeVersionsModal,
  } = useTaskProfessorData(courseIdNum)

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return <EmptyState title="Error" description={error} />
  }

  return (
    <div className="p-4">
      {selectedProject ? (
        <ProjectSubmissionsView
          project={selectedProject}
          submissions={submissionsByProject[selectedProject.id] || []}
          students={students}
          loadingSubmissions={loadingSubmissions}
          errorSubmissions={errorSubmissions}
          fetchSubmissions={fetchSubmissionsForProject}
          onBack={() => setSelectedProject(null)}
          onViewHistory={openVersionsModal}
        />
      ) : (
        <div className="mb-6">
          {projects.length === 0 ? (
            <EmptyState
              title="No hay tareas disponibles"
              description="Parece que aún no se han creado tareas para este curso."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {selectedSubmissionForModal && (
        <SubmissionHistoryModal
          isOpen={!!selectedSubmissionForModal}
          onClose={closeVersionsModal}
          submission={selectedSubmissionDetails}
          versions={versions}
          student={selectedSubmissionForModal.student}
        />
      )}
    </div>
  )
}

export default TaskProfessorSection
