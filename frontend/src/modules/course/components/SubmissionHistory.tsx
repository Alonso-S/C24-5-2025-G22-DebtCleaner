import React from 'react';

interface SubmissionVersion {
  id: number;
  versionNumber: number;
  fileUrl?: string;
  gitCommitHash?: string | null;
  createdAt: string;
}

interface SubmissionHistoryProps {
  versions: SubmissionVersion[];
  submissionGitRepositoryUrl?: string | null;
}

const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({
  versions,
  submissionGitRepositoryUrl,
}) => {
  return (
    <div>
      <h4 className="font-medium mb-2">Historial de entregas</h4>
      {versions.length === 0 ? (
        <div className="text-sm text-gray-600">No hay entregas previas.</div>
      ) : (
        <ul className="space-y-2">
          {versions.map((v) => (
            <li
              key={v.id}
              className="flex justify-between items-center p-2 bg-white rounded border"
            >
              <div>
                <div className="font-medium">Versión {v.versionNumber}</div>
                <div className="text-xs text-gray-500">
                  {new Date(v.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {v.fileUrl ? (
                  <a
                    href={v.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    Descargar
                  </a>
                ) : null}

                {v.gitCommitHash ? (
                  submissionGitRepositoryUrl ? (
                    <a
                      href={`${submissionGitRepositoryUrl.replace(/\.git$/, '')}/commit/${v.gitCommitHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 text-sm"
                    >
                      Commit {v.gitCommitHash.slice(0, 7)}
                    </a>
                  ) : (
                    <div className="text-sm text-gray-700">
                      Commit {v.gitCommitHash.slice(0, 7)}
                    </div>
                  )
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubmissionHistory;