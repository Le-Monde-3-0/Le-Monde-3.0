import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../router/router.dart';
import '../screens/user_draft_page.dart';
import '../screens/user_published_page.dart';

class BottomNav extends StatelessWidget {
  const BottomNav(this.child, {super.key});
  final Widget child;

  @override
    Widget build(BuildContext context) {
      return Scaffold(
        body: child,
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: _calculateSelectedIndex(context),
          onTap: (value) => _onBottomNavItemTap(value, context),
          items: [
            BottomNavigationBarItem(
              icon: GestureDetector(
                child: const Icon(Icons.newspaper),
              ),
              label: 'Articles',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.create),
              label: 'Écrire',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person),
              label: 'Profile',
              
            ),
          ],
          selectedLabelStyle: TextStyle(fontSize: 17),
          unselectedLabelStyle: TextStyle(fontSize: 14),
          unselectedItemColor: const Color.fromARGB(255, 255, 255, 255),
          selectedItemColor: Colors.white,
          backgroundColor: const Color.fromARGB(255, 0, 0, 0),
        ),
      );
    }

  void _onBottomNavItemTap(int value, BuildContext context) {
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
    }
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
    return 0;
  }
}