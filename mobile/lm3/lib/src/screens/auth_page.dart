import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'profile_page.dart';
import 'register_page.dart';
import '../services/Auth_service.dart';
import '../router/router.dart';

class AuthPage extends StatefulWidget {
  const AuthPage({super.key});

  @override
  State<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final UserService _userService = UserService();

  void _login(String email, String password) async {
    try {
      var result = await _userService.login(email, password);
      var token = result['token'];
      final storage = new FlutterSecureStorage();
      await storage.write(key: 'token', value: token);

      ProfileRoute().go(context);
    } catch (e) {
      print(e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Connexion')),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            TextFormField(
              controller: _emailController,
              decoration: InputDecoration(labelText: 'Adresse email ou nom d\'utilisateur'),
              keyboardType: TextInputType.emailAddress,
            ),
            TextFormField(
              controller: _passwordController,
              decoration: InputDecoration(labelText: 'Mot de passe'),
              obscureText: true,
            ),
            ElevatedButton(
              onPressed: () {
                _login(_emailController.text, _passwordController.text);
              },
              child: Text('Se connecter'),
            ),
            TextButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => CreateProfilePage()),
                );
              },
              child: Text('Créer un compte'),
            ),
          ],
        ),
      ),
    );
  }
}
