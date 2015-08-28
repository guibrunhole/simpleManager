(function() {

    'use strict';

    function sessionService($cookieStore, SESSION_KEYS) {

        return {

            createSession: function(sessionInfo) {

                $cookieStore.put(SESSION_KEYS.accessToken, sessionInfo.access_token);
                $cookieStore.put(SESSION_KEYS.refreshToken, sessionInfo.refresh_token);
                $cookieStore.put(SESSION_KEYS.expirationDate, (new Date().getTime()) + (sessionInfo.expires_in * 1000));
            },
            updateSession: function(newSessionInfo) {

                $cookieStore.put(SESSION_KEYS.accessToken, newSessionInfo.access_token);
                $cookieStore.put(SESSION_KEYS.refreshToken, newSessionInfo.refresh_token);
                $cookieStore.put(SESSION_KEYS.expirationDate, (new Date().getTime()) + (newSessionInfo.expires_in * 1000));
            },
            isLoggedIn: function() {

                return !!$cookieStore.get(SESSION_KEYS.accessToken);
            },
            getAccessToken: function() {

                return $cookieStore.get(SESSION_KEYS.accessToken);
            },
            getRefreshToken: function() {

                return $cookieStore.get(SESSION_KEYS.refreshToken);
            },
            getExpirationDate: function() {

                return $cookieStore.get(SESSION_KEYS.expirationDate);
            },
            destroySession: function() {

                $cookieStore.remove(SESSION_KEYS.accessToken);
                $cookieStore.remove(SESSION_KEYS.refreshToken);
                $cookieStore.remove(SESSION_KEYS.expirationDate);
            }
        };
    }

    angular.module('app.services').service('SessionService', ['$cookieStore', 'SESSION_KEYS',  sessionService]);
})();