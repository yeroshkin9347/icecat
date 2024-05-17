import React, { useState, useEffect, useMemo } from "react";
import get from "lodash/get";
import { Loader, Alert } from "cdm-ui-components";
import { getPreComputingLastJobByAction } from "cdm-shared/services/precomputing";
import { CheckCircle } from "@mui/icons-material";

function PreComputingJobStatus({
  preComputingActionId,
  // functions
  translate
}) {
  const [preComputingJob, setPreComputingJob] = useState(null);

  // load precomputing job
  useEffect(() => {
    let interval = null;

    // cleanup interval once job is done
    const _setJob = res => {
      const job = get(res, "data", null);
      setPreComputingJob(job);
      if (job && job.progress === job.total) clearInterval(interval);
    };

    // set interval for fetching job
    interval = setInterval(() => {
      // get last precomputing job
      getPreComputingLastJobByAction(preComputingActionId).then(res =>
        _setJob(res)
      );
    }, 10000);

    // first fetch of pre computing job
    getPreComputingLastJobByAction(preComputingActionId).then(res =>
      _setJob(res)
    );

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [preComputingActionId]);

  // memoized values
  const done = useMemo(
    () =>
      preComputingJob &&
      (preComputingJob.status === "DONE" ||
        preComputingJob.progress === preComputingJob.total),
    [preComputingJob]
  );

  if (done)
    return (
      <Alert success>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CheckCircle
            fontSize="small"
            color="inherit"
          />
          &nbsp;&nbsp;
          {translate(`export.meta.preComputingJobDone`)}
        </div>
      </Alert>
    );

  if (preComputingJob) {
    return (
        <Alert info>
          <Loader small/>
          &nbsp;&nbsp;
          {translate(`export.meta.preComputingJobPending`, preComputingJob)}
        </Alert>
    );
  }
  
  return (
      <Alert danger>
        {translate(`export.meta.preComputingJobNotDone`)}
      </Alert>
  );
}

export default PreComputingJobStatus;
