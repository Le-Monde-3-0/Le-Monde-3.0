import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'dart:convert';

import 'package:lm3/src/bloc/user/user_bloc.dart';
import 'package:lm3/src/bloc/user/user_event.dart';

import './widgets/bot_nav.dart';
import './router/router.dart';
import './bloc/user/user_bloc.dart';
import './models/user.dart';

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final FlutterSecureStorage _storage = FlutterSecureStorage();
  UserModel? _user;
  bool _isDarkMode = false;

  @override
  void initState() {
    super.initState();
    _initializeUser();
    _loadThemePreference();
  }

  Future<void> _initializeUser() async {
    String? userJson = await _storage.read(key: 'user');
    if (userJson != null && userJson.isNotEmpty) {
      setState(() {
        _user = UserModel.fromJson(jsonDecode(userJson));
      });
    }
  }

  Future<void> _loadThemePreference() async {
    String? themePreference = await _storage.read(key: 'theme');
    setState(() {
      _isDarkMode = themePreference == 'dark';
    });
  }

  Future<void> _toggleTheme() async {
    setState(() {
      _isDarkMode = !_isDarkMode;
    });
    await _storage.write(key: 'theme', value: _isDarkMode ? 'dark' : 'light');
  }

  @override
  Widget build(BuildContext context) {
    final router = GoRouter(
      routes: [
        ShellRoute(
          builder: (context, state, child) {
            return BottomNav(child);
          },
          routes: $appRoutes,
        ),
      ],
      initialLocation: '/write',
      redirect: (context, state) async {
        String? user = await _storage.read(key: 'user');
        if (user == null || user.isEmpty) {
          print('User not found in secure storage');
          return '/auth';
        }
        return null;
      },
    );

    return BlocProvider<UserBloc>(
      create: (context) {
        UserBloc bloc = UserBloc(FlutterSecureStorage());
        if (_user != null) {
          bloc.add(UserLogin(_user!));
        }
        return bloc;
      },
      child: MaterialApp.router(
        theme: _isDarkMode
            ? ThemeData.dark().copyWith(
              )
            : ThemeData.light().copyWith(
              ),
        routerConfig: router,
        builder: (context, child) {
          return Scaffold(
            appBar: AppBar(

              title: Text('Anthologia'),
              actions: [
                IconButton(
                  icon: Icon(
                    _isDarkMode ? Icons.light_mode : Icons.dark_mode,
                  ),
                  onPressed: _toggleTheme,
                ),
              ],
            ),
            body: child,
          );
        },
      ),
    );
  }
}
