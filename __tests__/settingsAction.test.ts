describe('settingsAction', () => {
    const changeUsername = jest.fn();
    const user = { username: 'Tom' };
    changeUsername.mockImplementation((changedUsername: string) => {
        if (user.username == changedUsername) {
            return { success: false, error: 'username cannot be the same' };
        }
        return { success: true, error: null };
    });

    it('should return false if changed username and the original username are the same', () => {
        expect(changeUsername('Tom')).toStrictEqual({
            success: false,
            error: 'username cannot be the same',
        });
    });

    it('should return true if changed username and the original username aren\'t the same', () => {
        expect(changeUsername('Jerry')).toStrictEqual({
            success: true,
            error: null,
        });
    }); 
});
