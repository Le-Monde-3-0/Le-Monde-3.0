import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'auth_page.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});
  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final storage = FlutterSecureStorage();
  bool isPublic = false;

  @override
  void initState() {
    super.initState();
    checkLoginStatus(context);
    // Ici, vous pouvez ajouter la logique pour récupérer le statut actuel du profil
  }

  void checkLoginStatus(BuildContext context) async {
    String? token = await storage.read(key: 'token');
    print(token);
    if (token == null || token.isEmpty) {
      print('token null');
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => AuthPage()),
      );
    }
  }

  void logout(BuildContext context) async {
    await storage.delete(key: 'token');
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => AuthPage()),
    );
  }

  void changeProfileStatus() async {
    setState(() {
      isPublic = !isPublic;
    });
    // Ici, vous pouvez ajouter la logique pour mettre à jour le statut du profil sur votre serveur
  }

  @override
  Widget build(BuildContext context) {
    checkLoginStatus(context);
    return Scaffold(
      appBar: AppBar(
        title: Text('Profil'),
        actions: [
          IconButton(
            icon: Icon(Icons.more_vert),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => MoreOptionsPage(logout: logout),
                ),
              );
            },
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Switch(
              value: isPublic,
              onChanged: (value) {
                changeProfileStatus();
              },
              activeTrackColor: Colors.green,
              activeColor: Colors.white,
              inactiveTrackColor: Colors.grey,
              inactiveThumbColor: Colors.white,
            ),
          ],
        ),
      ),
    );
  }
}

class MoreOptionsPage extends StatelessWidget {
  final Function(BuildContext) logout;

  const MoreOptionsPage({required this.logout});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Paramètres'),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Divider(
            height: 4,
            thickness: 4,
            color: Colors.grey,
          ),
          Padding(
            padding: const EdgeInsets.only(left: 16.0),
            child: Text(
              'Connexion',
              style: TextStyle(
                color: Colors.grey,
                fontFamily: 'Roboto',
                fontSize: 17,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 16.0),
            child: TextButton(
              onPressed: () {
                logout(context);
              },
              child: Text(
                'Se déconnecter',
                style: TextStyle(
                  color: Colors.red,
                  fontFamily: 'Roboto',
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
