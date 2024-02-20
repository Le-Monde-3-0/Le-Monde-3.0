import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../router/router.dart';
import '../screens/brouillons_page.dart';

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
              onLongPress: () => _showArticlesOptions(context),
              child: const Icon(Icons.newspaper),
            ),
            label: 'articles',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.create),
            label: 'write',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'profile',
          ),
        ],
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

  void _showArticlesOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            ListTile(
              leading: Icon(Icons.public),
              title: Text("Mes publications"),
              onTap: () {
                // Handle "Mes publications" tap
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: Icon(Icons.drafts),
              title: Text("Mes brouillons"),
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => BrouillonsWidget(),
                  ),
                );
              },
            ),
            ListTile(
              leading: Icon(Icons.bar_chart),
              title: Text("Statistiques"),
              onTap: () {

                Navigator.pop(context);
              },
            ),
          ],
        );
      },
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
    return 0;
  }
}