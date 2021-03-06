/*jshint unused:false*/

function rxNotifyCtrl ($rootScope, $scope, rxNotify, rxPromiseNotifications, $q) {
    $scope.message = 'My message';

    $scope.options = {
        type: 'info',
        timeout: -1,
        dismissable: true,
        show: 'immediate',
        repeat: true
    };

    $scope.ondismiss = {
        should: false,
        method: function (msg) {
            /* global alert */
            alert('We are dismissing the message: ' + msg.text);
        }
    };

    $scope.routeChange = function (stack) {
        $rootScope.$broadcast('$routeChangeStart', {});
        $rootScope.$broadcast('$routeChangeSuccess', {});
    };

    $scope.add = function (stack) {
        var messageOptions = _.clone($scope.options);

        if ($scope.ondismiss.should) {
            messageOptions.ondismiss = _.clone($scope.ondismiss.method);
        }

        messageOptions.stack = stack;

        rxNotify.add($scope.message, messageOptions);
    };

    // add a default messages (to custom stack so they don't show on the main page)
    rxNotify.add('Helpful Information', {
        stack: 'demo'
    });
    rxNotify.add('Loading', {
        loading: true,
        stack: 'demo'
    });
    rxNotify.add('You did it!', {
        type: 'success',
        stack: 'demo'
    });
    rxNotify.add('Careful now...', {
        type: 'warning',
        stack: 'demo'
    });
    rxNotify.add('Under Attack by Aliens', {
        type: 'error',
        stack: 'custom'
    });

    // stuff for rxPromiseNotifications
    $scope.addPromise = function () {
        $scope.deferred = $q.defer();

        var promiseScope = rxPromiseNotifications.add($scope.deferred.promise, {
            loading: 'Loading Message',
            success: 'Success Message',
            error: 'Error Message'
        }, 'demo');
    };
}
