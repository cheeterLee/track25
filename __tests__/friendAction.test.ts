describe('friendAction', () => {
    let user: any;
    beforeEach(() => {
        user = null;
    });

    const existingFriendsIds = ['123', '456'];

    const createInvitation = jest.fn();
    createInvitation.mockImplementation(() => {
        if (!user) {
            return {
                success: false,
                error: 'no user',
            };
        }
    });

    const rejectRequest = jest.fn();
    rejectRequest.mockImplementation(() => {
        if (!user) {
            return {
                success: false,
                error: 'no user',
            };
        }
    });

    const deleteFriend = jest.fn();
    deleteFriend.mockImplementation(() => {
        if (!user) {
            return {
                success: false,
                error: 'no user',
            };
        }
    });

    const createGroup = jest.fn();
    createGroup.mockImplementation(() => {
        if (!user) {
            return {
                success: false,
                error: 'no user',
            };
        }
    });

    const searchUser = jest.fn();
    searchUser.mockImplementation(() => {
        if (!user) {
            return {
                success: false,
                error: 'no user',
            };
        }
    });

    const acceptFriendRequest = jest.fn();
    acceptFriendRequest.mockImplementation((senderId: string) => {
        if (existingFriendsIds.includes(senderId)) {
            return { success: true, error: 'duplicate request' };
        }
        return { success: true, error: null };
    });

    it('should return false if no user create invitation', () => {
        expect(createInvitation()).toStrictEqual({
            success: false,
            error: 'no user',
        });
    });

    it('should return duplicate if senderId exist in friends', () => {
        expect(acceptFriendRequest('123')).toStrictEqual({
            success: true,
            error: 'duplicate request',
        });
    });

    it("should return true if senderId doesn't exist in friends", () => {
        expect(acceptFriendRequest('789')).toStrictEqual({
            success: true,
            error: null,
        });
    });

    it('should return false if no user reject request', () => {
        expect(rejectRequest()).toStrictEqual({
            success: false,
            error: 'no user',
        });
    }); 

    it('should return false if no user delete friend', () => {
        expect(deleteFriend()).toStrictEqual({
            success: false,
            error: 'no user',
        });
    });

    it('should return false if no user create group', () => {
        expect(createGroup()).toStrictEqual({
            success: false,
            error: 'no user',
        });
    }); 

    it('should return false if no user search user', () => {
        expect(searchUser()).toStrictEqual({
            success: false,
            error: 'no user',
        });
    });
});
