import React, { Suspense } from 'react';
import { Skeleton } from '../../../../shared/components/ui';
import { CreateCourseForm } from '../../../course/components/CreateCourseForm';

const CreateCourseTab: React.FC = () => {
  return (
    <div className="p-4">
      <Suspense fallback={
        <div className="space-y-4">
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={50} />
        </div>
      }>
        <CreateCourseForm />
      </Suspense>
    </div>
  );
};

export default CreateCourseTab;