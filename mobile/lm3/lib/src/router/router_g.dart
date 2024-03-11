part of 'router.dart';

// **************************************************************************
// GoRouterGenerator
// **************************************************************************

List<GoRoute> get $appRoutes => [
      $articlesRoute,
      $writeRoute,
      $profileRoute,
      $authRoute,
      $bookmarksRoute,
];
GoRoute get $bookmarksRoute => GoRouteData.$route(
path: '/bookmarks', 
factory: $BookmarksRouteExtension._fromState,
);
extension $BookmarksRouteExtension on Bookmarks_Route{
  static Bookmarks_Route _fromState(GoRouterState state) => Bookmarks_Route();

  String get location => GoRouteData.$location(
    '/bookmarks',
    );
  void go(BuildContext context) => context.go(location,extra: this);
  void push(BuildContext context) => context.push(location, extra: this);
  
}


GoRoute get $articlesRoute => GoRouteData.$route(
  path: '/articles',
  factory: $ArticlesRouteExtension._fromState,
);
extension $ArticlesRouteExtension on ArticlesRoute {
  static ArticlesRoute _fromState(GoRouterState state) => ArticlesRoute();

  String get location => GoRouteData.$location(
    '/articles',
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
