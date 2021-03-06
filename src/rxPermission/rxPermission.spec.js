/* jshint node: true */
describe('rxPermission', function () {
    describe('rxPermission Directive', function () {
        var scope, compile, rootScope, el, elRoles, elFail, elFailRoles;
        var validTemplate = '<rx-permission role="pass">Hello</rx-permission>';
        var validRolesTemplate = '<rx-permission role="pass,also">Hello</rx-permission>';
        var invalidTemplate = '<rx-permission role="fail">Hello</rx-permission>';
        var invalidRolesTemplate = '<rx-permission role="fail,failure-role">Hello</rx-permission>';

        beforeEach(function () {
            module('encore.ui.rxPermission', function ($provide) {
                $provide.decorator('Permission', function ($delegate) {
                    $delegate.hasRole = function (role) {
                        return _.contains(role, 'pass') || _.contains(role, 'also');
                    };

                    return $delegate;
                });
            });

            module('templates/rxPermission.html');

            inject(function ($location, $rootScope, $compile) {
                rootScope = $rootScope;
                scope = $rootScope.$new();
                compile = $compile;
            });

            el = helpers.createDirective(validTemplate, compile, scope);
            elRoles = helpers.createDirective(validRolesTemplate, compile, scope);
            elFail = helpers.createDirective(invalidTemplate, compile, scope);
            elFailRoles = helpers.createDirective(invalidRolesTemplate, compile, scope);
        });

        it('rxPermission: should display text when user has role', function () {
            expect(el.text().trim()).to.be.eq('Hello');
        });

        it('rxPermission: should display text when user has any of multiple roles', function () {
            expect(elRoles.text().trim()).to.be.eq('Hello');
        });

        it('rxPermission: should not display text when user does not have role', function () {
            expect(elFail.text().trim()).to.be.empty;
        });

        it('rxPermission: should not display text when user has none of multiple roles', function () {
            expect(elFailRoles.text().trim()).to.be.empty;
        });

    });

    describe('Permission', function () {
        var permission, session, mockToken;

        mockToken = {
            access: {
                token:
                    {
                        id: 'someid',
                    },
                    user: {
                        id: 'joe.customer',
                        'roles': [{ 'id': '9','name': 'Customer' },
                                  { 'id': '9','name': 'Test' }]
                    }
                }
            };

        beforeEach(function () {
            module('encore.ui.rxPermission');
            module('encore.ui.rxSession');

            inject(function ($injector) {
                permission = $injector.get('Permission');
                session = $injector.get('Session');
                session.getToken = sinon.stub().returns(mockToken);
            });
        });

        it('Permission service: should return list of roles on getRoles', function () {
            expect(permission.getRoles()).not.be.empty;
            expect(permission.getRoles().length).to.be.eq(2);

            session.getToken = sinon.stub().returns(null);
            expect(permission.getRoles()).to.be.empty;
            expect(session.getToken).to.be.called;
        });

        it('Permission service: should validate if user has role', function () {
            expect(permission.hasRole('Customer')).to.be.true;
            expect(permission.hasRole('Invalid Role')).to.be.false;
            expect(session.getToken).to.be.called;
        });

        it('Permission service: should validate if user has any of roles', function () {
            expect(permission.hasRole('Customer, Invalid Role')).to.be.true;
            expect(permission.hasRole('Custom, Er Role, Today')).to.be.false;
            expect(permission.hasRole('Test, Er Role, Today')).to.be.true;
            expect(session.getToken).to.be.called;
        });

        it('Permission service: should accept array of roles', function () {
            expect(permission.hasRole(['Customer', 'Invalid Role'])).to.be.true;
            expect(permission.hasRole(['Custom', 'Er Role', 'Today'])).to.be.false;
            expect(permission.hasRole(['Test', 'Er Role', 'Today'])).to.be.true;
            expect(session.getToken).to.be.called;

        });

        it('Permission service: should validate if user has all roles', function () {
            expect(permission.hasAllRoles(['Customer', 'Invalid Role'])).to.be.false;
            expect(permission.hasAllRoles(['Customer', 'Test'])).to.be.true;
            expect(permission.hasAllRoles(['Customer', 'Test', 'Today'])).to.be.false;
            expect(session.getToken).to.be.called;
        });

    });
});
