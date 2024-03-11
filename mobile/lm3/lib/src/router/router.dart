import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../screens/profile_page.dart';
import '../screens/write_page.dart';
import '../screens/articles_page.dart';
import '../screens/auth_page.dart';
import '../screens/bookmarks_page.dart';

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
    return const Bookmarks_Page();
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

@TypedGoRoute<AuthRoute>(path: '/auth')
@immutable
class AuthRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) {
    return const AuthPage();
  }
}


@TypedGoRoute<ArticlesRoute>(path: '/bookmarks')
@immutable
class Bookmarks_Route extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) {
    return const Bookmarks_Page();
  }
}