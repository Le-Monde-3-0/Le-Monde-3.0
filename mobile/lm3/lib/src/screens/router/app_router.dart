import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';



// import 'package:flutter_bloc_concepts/presentation/screens/home_screen.dart';
// import 'package:flutter_bloc_concepts/presentation/screens/second_screen.dart';
// import 'package:flutter_bloc_concepts/presentation/screens/third_screen.dart';
import 'package:lm3/src/screens/profile/profile_page.dart';
import 'package:lm3/src/screens/write_page.dart';
import 'package:lm3/src/screens/articles_page.dart';
import 'package:lm3/src/screens/Auth/auth_page.dart';
import 'package:lm3/src/screens/search_page.dart';

class AppRouter {
  Route onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(
          builder: (_) => const ArticlesPage(),
        );
      case '/articles':
        return MaterialPageRoute(
          builder: (_) => const ArticlesPage(),
        );
      case '/write':
        return MaterialPageRoute(
          builder: (_) => const WritePage(),
        );
      case '/search':
        return MaterialPageRoute(
          builder: (_) => const SearchPage(),
        );
      case '/profile':
        return MaterialPageRoute(
          builder: (_) => const ProfilePage(),
        );
      case '/auth':
        return MaterialPageRoute(
          builder: (_) => const AuthPage(),
        );
      default:
        return MaterialPageRoute(
          builder: (_) => const ArticlesPage(),
        );
    }
  }
}