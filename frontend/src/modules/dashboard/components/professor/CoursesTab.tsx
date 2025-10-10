import React, { Suspense } from 'react';
import { Skeleton } from '../../../../shared/components/ui';
import { CourseList } from '../../../course/components/CourseList';

const CoursesTab: React.FC = () => {
  return (
    <div className="p-4">
      <Suspense fallback={
        <div className="space-y-4">
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="rectangular" height={100} />
          <Skeleton variant="rectangular" height={100} />
          <Skeleton variant="rectangular" height={100} />
        </div>
      }>
        <CourseList />
      </Suspense>
    </div>
  );
};

export default CoursesTab;