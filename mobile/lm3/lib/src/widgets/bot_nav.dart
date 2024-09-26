import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lm3/src/router/router.dart';
import 'package:lm3/src/screens/search_page.dart';

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
            const BottomNavigationBarItem(
              icon: Icon(Icons.create),
              label: 'Écrire',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.search),
              label: 'Rechercher',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.person),
              label: 'Profile',
            ),
          ],
        // selectedLabelStyle: const TextStyle(fontSize: 17),
        // unselectedLabelStyle: const TextStyle(fontSize: 14),
        unselectedItemColor: Colors.grey, // Couleur pour les items non sélectionnés
        selectedItemColor: Colors.blue, // Couleur pour l'item sélectionné
        backgroundColor: Colors.black,  // Couleur de fond de la BottomNavigationBar
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
        SearchRoute().go(context);
        break;
      case 3:
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
    if (location.startsWith('/search')) {
      return 2;
    }
    if (location.startsWith('/profile')) {
      return 3;
    }
    return 0;
  }
}