part of 'router.dart';

// **************************************************************************
// GoRouterGenerator
// **************************************************************************

List<GoRoute> get $appRoutes => [
      $articlesRoute,
      $writeRoute,
      $profileRoute,
      $searchRoute,
      $authRoute,
];

GoRoute get $articlesRoute => GoRouteData.$route(
  path: '/articles',
  factory: $ArticlesRouteExtension._fromState,
);
extension $ArticlesRouteExtension on ArticlesRoute {
  static ArticlesRoute _fromState(GoRouterState state) => ArticlesRoute();

  String get location => GoRouteData.$location(
    '/articles'
  );

  void go(BuildContext context) => context.go(location, extra: this);
  void push(BuildContext context) => context.push(location, extra: this);
}

GoRoute get $writeRoute => GoRouteData.$route(
      path: '/write',
      factory: $WriteRouteExtension._fromState,
);
extension $WriteRouteExtension on WriteRoute {
  static WriteRoute _fromState(GoRouterState state) => WriteRoute();

  String get location => GoRouteData.$location(
    '/write',
  );

  void go(BuildContext context) => context.go(location, extra: this);
  void push(BuildContext context) => context.push(location, extra: this);
}

GoRoute get $profileRoute => GoRouteData.$route(
  path: '/profile',
  factory: $ProfileRouteExtension._fromState,
);
extension $ProfileRouteExtension on ProfileRoute {
  static ProfileRoute _fromState(GoRouterState state) => ProfileRoute();

  String get location => GoRouteData.$location(
    '/profile',
  );

  void go(BuildContext context) => context.go(location, extra: this);
  void push(BuildContext context) => context.push(location, extra: this);
}

GoRoute get $searchRoute => GoRouteData.$route(
  path: '/search',
  factory: $SearchRouteExtension._fromState,
);
extension $SearchRouteExtension on SearchRoute {
  static SearchRoute _fromState(GoRouterState state) => SearchRoute();

  String get location => GoRouteData.$location(
    '/search',
  );

  void go(BuildContext context) => context.go(location, extra: this);
  void push(BuildContext context) => context.push(location, extra: this);
}

GoRoute get $authRoute => GoRouteData.$route(
  path: '/auth',
  factory: $AuthRouteExtension._fromState,
);
extension $AuthRouteExtension on AuthRoute {
  static AuthRoute _fromState(GoRouterState state) => AuthRoute();

  String get location => GoRouteData.$location(
    '/auth',
  );

  void go(BuildContext context) => context.go(location, extra: this);
  void push(BuildContext context) => context.push(location, extra: this);
}
