import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../core/api/apiClient';
import { useAuth } from '../../auth/hooks/useAuth';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'late';
  courseId: string;
}

export interface Submission {
  id: string;
  taskId: string;
  studentId: string;
  status: 'pending' | 'submitted' | 'reviewed';
  grade?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  versions: SubmissionVersion[];
}

export interface SubmissionVersion {
  id: string;
  submissionId: string;
  content: string;
  fileUrl?: string;
  gitUrl?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  submissionId: string;
  userId: string;
  content: string;
  createdAt: string;
  parentId?: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

type Role = 'student' | 'professor' | 'admin';

interface User {
  id: string;
  role: Role;
}

export function useCourseTask(courseId?: string, taskId?: string) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState({
    tasks: false,
    submission: false,
    comments: false,
  });
  const [error, setError] = useState<{
    tasks: any;
    submission: any;
    comments: any;
  }>({
    tasks: null,
    submission: null,
    comments: null,
  });

  // Fetch tasks for a course
  const fetchTasks = useCallback(async () => {
    if (!courseId) return;
    
    setLoading(prev => ({ ...prev, tasks: true }));
    setError(prev => ({ ...prev, tasks: null }));
    
    try {
      const response = await api.get(`/courses/${courseId}/tasks`);
      setTasks(response.data);
      
      // If taskId is provided, set the selected task
      if (taskId) {
        const task = response.data.find((t: Task) => t.id === taskId);
        if (task) setSelectedTask(task);
      }
    } catch (err) {
      setError(prev => ({ ...prev, tasks: err }));
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }));
    }
  }, [courseId, taskId]);

  // Fetch submission for a task
  const fetchSubmission = useCallback(async () => {
    if (!taskId || !user?.id) return;
    
    setLoading(prev => ({ ...prev, submission: true }));
    setError(prev => ({ ...prev, submission: null }));
    
    try {
      const endpoint = (user as User).role === 'student' 
        ? `/tasks/${taskId}/submissions/student/${user.id}`
        : `/tasks/${taskId}/submissions`;
        
      const response = await api.get(endpoint);
      setSubmission(response.data);
    } catch (err) {
      setError(prev => ({ ...prev, submission: err }));
    } finally {
      setLoading(prev => ({ ...prev, submission: false }));
    }
  }, [taskId, user]);

  // Fetch comments for a submission
  const fetchComments = useCallback(async () => {
    if (!submission?.id) return;
    
    setLoading(prev => ({ ...prev, comments: true }));
    setError(prev => ({ ...prev, comments: null }));
    
    try {
      const response = await api.get(`/submissions/${submission.id}/comments`);
      setComments(response.data);
    } catch (err) {
      setError(prev => ({ ...prev, comments: err }));
    } finally {
      setLoading(prev => ({ ...prev, comments: false }));
    }
  }, [submission]);

  // Submit a new version
  const submitVersion = useCallback(async (data: { 
    content?: string;
    fileUrl?: string;
    gitUrl?: string;
  }) => {
    if (!taskId || !user?.id) return null;
    
    let submissionId = submission?.id;
    
    // If no submission exists, create one
    if (!submissionId) {
      const newSubmission = await api.post(`/tasks/${taskId}/submissions`, {
        studentId: user.id,
        status: 'submitted'
      });
      submissionId = newSubmission.data.id;
    }
    
    // Create a new version
    const response = await api.post(`/submissions/${submissionId}/versions`, data);
    
    // Refresh submission data
    fetchSubmission();
    
    return response.data;
  }, [taskId, user, submission, fetchSubmission]);

  // Add a comment
  const addComment = useCallback(async (content: string, parentId?: string) => {
    if (!submission?.id || !user?.id) return null;
    
    const response = await api.post(`/submissions/${submission.id}/comments`, {
      userId: user.id,
      content,
      parentId
    });
    
    // Refresh comments
    fetchComments();
    
    return response.data;
  }, [submission, user, fetchComments]);

  // Review submission (for professors)
  const reviewSubmission = useCallback(async (data: {
    grade?: number;
    feedback?: string;
    status: 'reviewed';
  }) => {
    if (!submission?.id || ((user as User)?.role !== 'professor')) return null;
    
    const response = await api.patch(`/submissions/${submission.id}`, data);
    
    // Refresh submission data
    fetchSubmission();
    
    return response.data;
  }, [submission, user, fetchSubmission]);

  // Select a task
  const selectTask = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  // Initial data loading
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (selectedTask?.id) {
      fetchSubmission();
    }
  }, [selectedTask, fetchSubmission]);

  useEffect(() => {
    if (submission?.id) {
      fetchComments();
    }
  }, [submission, fetchComments]);

  return {
    tasks,
    selectedTask,
    submission,
    comments,
    loading,
    error,
    selectTask,
    fetchTasks,
    fetchSubmission,
    fetchComments,
    submitVersion,
    addComment,
    reviewSubmission
  };
}