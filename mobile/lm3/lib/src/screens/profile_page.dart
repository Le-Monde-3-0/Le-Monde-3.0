import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:go_router/go_router.dart';

import 'auth_page.dart';
import '../router/router.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});
  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final storage = FlutterSecureStorage();

  @override
  void initState() {
    super.initState();
  }

  void checkLoginStatus(BuildContext context) async {
    String? token = await storage.read(key: 'token');
    if (token == null || token.isEmpty) {
      print('token null');
      AuthRoute().go(context);
    }
  }
  void logout(BuildContext context) async {
    await storage.delete(key: 'token');
    AuthRoute().go(context);
  }

  @override
  Widget build(BuildContext context) {
    checkLoginStatus(context);
    return Scaffold(
      appBar: AppBar(
        title: Text('Profil'),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            logout(context);
          },
          child: Text('Se déconnecter'),
        ),
      ),
    );
  }
}
