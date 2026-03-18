import React from "react";
import InputSkeleton from "./InputSkeleton";
import TextSkeleton from "./TextSkeleton";

/**
 * Form skeleton - for profile forms, etc.
 */
const FormSkeleton = ({ fields = 3, className = "" }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <TextSkeleton lines={1} width="1/4" height="h-3" />
          <InputSkeleton />
        </div>
      ))}
    </div>
  );
};

export default FormSkeleton;

