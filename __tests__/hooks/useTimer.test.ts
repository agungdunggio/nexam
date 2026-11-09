import { act, renderHook } from '@testing-library/react';
import { useTimerStore } from '@/stores/timerStore';

describe('useTimerStore', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useTimerStore.getState().stopTimer();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts countdown and ticks every second', () => {
    const { result } = renderHook(() => useTimerStore());

    act(() => {
      result.current.startTimer(60);
    });

    expect(result.current.remainingSeconds).toBe(60);
    expect(result.current.isRunning).toBe(true);
    expect(result.current.formattedTime).toBe('01:00');

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.remainingSeconds).toBe(55);
    expect(result.current.formattedTime).toBe('00:55');
  });

  it('calls onTimeUp when reaching zero', () => {
    const onTimeUpMock = jest.fn();
    const { result } = renderHook(() => useTimerStore());

    act(() => {
      result.current.setCallbacks(onTimeUpMock);
      result.current.startTimer(2);
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.remainingSeconds).toBe(0);
    expect(onTimeUpMock).toHaveBeenCalled();
  });
});
