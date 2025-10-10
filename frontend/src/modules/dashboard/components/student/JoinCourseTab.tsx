import React, { Suspense } from 'react';
import { Skeleton } from '../../../../shared/components/ui';
import JoinCourse from '../../components/JoinCourse';

const JoinCourseTab: React.FC = () => {
  return (
    <div className="p-4">
      <Suspense fallback={
        <div className="space-y-4">
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={50} />
        </div>
      }>
        <JoinCourse />
      </Suspense>
    </div>
  );
};

export default JoinCourseTab;