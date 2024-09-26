import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:lm3/src/screens/profile/profile_page.dart';
import 'package:lm3/src/screens/write_page.dart';
import 'package:lm3/src/screens/articles_page.dart';
import 'package:lm3/src/screens/Auth/auth_page.dart';
import 'package:lm3/src/screens/search_page.dart';

part './router_g.dart';


@TypedGoRoute<ArticlesRoute>(path: '/articles')
@immutable
class ArticlesRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) {
    return const ArticlesPage();
  }
}

@TypedGoRoute<HomeRoute>(path: '/')
@immutable
class HomeRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) {
    return const ArticlesPage();
  }
}

@TypedGoRoute<WriteRoute>(path: '/write')
@immutable
class WriteRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) {
    return const WritePage();
  }
}

@TypedGoRoute<ProfileRoute>(path: '/profile')
@immutable
class ProfileRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) {
    return const ProfilePage();
  }
}

@TypedGoRoute<SearchRoute>(path: '/search')
@immutable
class SearchRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) {
    return const SearchPage();
  }
}


@TypedGoRoute<AuthRoute>(path: '/auth')
@immutable
class AuthRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) {
    return const AuthPage();
  }
}
