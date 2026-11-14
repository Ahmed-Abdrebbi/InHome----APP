// File: src/features/tracking/store/useJobStore.js
import { create } from 'zustand';
import jobsApi from '../api/jobsApi';
import { BOOKING_STATUSES } from '../../../core/config/statuses';

export const useJobStore = create((set, get) => ({
  activeJob: null,
  status: BOOKING_STATUSES.MATCHED,
  workerLocation: null,
  loading: false,
  error: null,

  loadJob: async (jobId) => {
    set({ loading: true, error: null });
    try {
      const job = await jobsApi.getJob(jobId);
      set({
        activeJob: job,
        status: job.status,
        loading: false,
      });
      return job;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  advanceStatus: async (nextStatus) => {
    const { activeJob } = get();
    if (!activeJob) return;
    set({ loading: true });
    try {
      const updated = await jobsApi.updateStatus(activeJob.id, nextStatus);
      set({
        activeJob: updated,
        status: updated.status,
        loading: false,
      });
      return updated;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  updateWorkerLocation: async (coords) => {
    const { activeJob } = get();
    set({ workerLocation: coords });
    if (activeJob) {
      try {
        await jobsApi.sendWorkerLocation(activeJob.id, coords);
      } catch (e) {
        console.warn('[useJobStore] updateWorkerLocation error:', e);
      }
    }
  },

  reset: () => {
    set({
      activeJob: null,
      status: BOOKING_STATUSES.MATCHED,
      workerLocation: null,
      loading: false,
      error: null,
    });
  },
}));

export default useJobStore;
