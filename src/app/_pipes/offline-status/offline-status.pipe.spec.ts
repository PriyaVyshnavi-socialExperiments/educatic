import { OfflineStatusPipe } from './offline-status.pipe';

describe('OfflineStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new OfflineStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
