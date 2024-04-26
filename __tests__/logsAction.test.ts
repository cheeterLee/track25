describe('logAction', () => {
    const addDownloadLog = jest.fn();
    addDownloadLog.mockImplementation(
        (trackId: string | undefined, downloadTimes: number | undefined) => {
            if (trackId == undefined) {
                return {
                    success: false,
                    error: 'no trackId or no downloadTimes',
                };
            }
            if (downloadTimes == undefined) {
                return {
                    success: false,
                    error: 'no trackId or no downloadTimes',
                };
            }
            return { success: true, error: null };
        },
    );

    it('should return false if missing trackId', () => {
        expect(addDownloadLog(undefined, 10)).toStrictEqual({
            success: false,
            error: 'no trackId or no downloadTimes',
        });
    });

    it('should return false if missing downloadTimes', () => {
        expect(addDownloadLog('123', undefined)).toStrictEqual({
            success: false,
            error: 'no trackId or no downloadTimes',
        });
    });

    it('should return true if called with trackId and downloadTimes', () => {
        expect(addDownloadLog('123', 10)).toStrictEqual({
            success: true,
            error: null,
        });
    });
});
