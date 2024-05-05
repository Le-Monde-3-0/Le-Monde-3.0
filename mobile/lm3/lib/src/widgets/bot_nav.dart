import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../router/router.dart';

class BottomNav extends StatelessWidget {
  const BottomNav(this.child, {super.key});
  final Widget child;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _calculateSelectedIndex(context),
        onTap: (value) {
          switch (value) {
            case 0:
              ArticlesRoute().go(context);
              break;
            case 1:
              WriteRoute().go(context);
              break;
            case 2:
              ProfileRoute().go(context);
              break;
            case 3:
              AuthRoute().go(context);
              break;
          }
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.newspaper),
            label: 'articles',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.newspaper),
            label: 'write',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'profile',
          ),
        ],
      ),
    );
  }

  int _calculateSelectedIndex(BuildContext context) {
    final String location = GoRouterState.of(context).uri.path;
    if (location.startsWith('/articles')) {
      return 0;
    }
    if (location.startsWith('/write')) {
      return 1;
    }
    if (location.startsWith('/profile')) {
      return 2;
    }
    if (location.startsWith('/auth')) {
      return 2;
    }
    return 0;
  }
}