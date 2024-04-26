describe('authAction', () => {
    const user = {
        username: 'John',
        password: '123456',
    };
    const existedUser = ['Tom', 'Jerry'];
    const signup = jest.fn();
    signup.mockImplementation(
        (username: string, password: string, confirmPassword: string) => {
            if (username.length < 2) {
                return {
                    message: 'username must be 2 characters long',
                    success: false,
                };
            }
            if (password !== confirmPassword) {
                return {
                    message: 'password must equal to confirm password',
                    success: false,
                };
            }
            if (existedUser.includes(username)) {
                return { success: false, message: 'Duplicate username.' };
            }

            return { success: true, message: '' };
        },
    );
    const login = jest.fn();
    login.mockImplementation(
        (username: string | undefined, password: string) => {
            if (username === undefined) {
                return { message: 'null user', success: false };
            }
            if (user.password !== password) {
                return {
                    message: 'Incorrect password',
                    success: false,
                };
            }
            return { success: true, message: '' };
        },
    );
    const logout = jest.fn();
    let session = null;
    logout.mockImplementation(() => {
        if (!session) {
            return {
                success: false,
                message: 'Unauthorized',
            };
        }
    });

    it('should false if no username to short when trying to signup', () => {
        expect(signup('t', '123', '123')).toStrictEqual({
            message: 'username must be 2 characters long',
            success: false,
        });
    });

    it('should false if no password not equal to confirm password', () => {
        expect(signup('test', '123', '124')).toStrictEqual({
            message: 'password must equal to confirm password',
            success: false,
        });
    });

    it('should return false if username already exists', () => {
        expect(signup('Tom', '123', '123')).toStrictEqual({
            success: false,
            message: 'Duplicate username.',
        });
    });

    it('should return no error when signing up with acceptable params', () => {
        expect(signup('David', '123', '123')).toStrictEqual({
            success: true,
            message: '',
        });
    });

    it('should return false if no username provided when trying to login', () => {
        expect(login(undefined, '123456')).toStrictEqual({
            message: 'null user',
            success: false,
        });
    });

    it('should return false if no username provided when trying to login', () => {
        expect(login('John', '1234567')).toStrictEqual({
            message: 'Incorrect password',
            success: false,
        });
    });

    it('should return false if wrong password provided when trying to login', () => {
        expect(login('John', '1234567')).toStrictEqual({
            message: 'Incorrect password',
            success: false,
        });
    });

    it('should return no error if provided correct password when trying to login', () => {
        expect(login('John', '123456')).toStrictEqual({
            message: '',
            success: true,
        });
    });

    it('should return unauthorized if user not authenticated when trying to logout', () => {
        expect(logout()).toStrictEqual({
            success: false,
            message: 'Unauthorized',
        });
    });

    it('should return unauthorized if user not authenticated when trying to logout', () => {
        expect(logout()).toStrictEqual({
            success: false,
            message: 'Unauthorized',
        });
    });
});
