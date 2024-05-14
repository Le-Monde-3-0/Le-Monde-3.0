import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:go_router/go_router.dart';

import 'auth_page.dart';
import '../router/router.dart';
import '../screens/user_draft_page.dart';
import '../screens/user_published_page.dart';
import '../screens/user_liked_article_page.dart';

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
      body: Column(
        children: [
          Expanded(
            child: GridView.count(
              crossAxisCount: 2,
              children: <Widget>[
                Card(
                  child: InkWell(
                    onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (context) => PublishedWidget())),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Icon(Icons.public, size: 50),
                        Text('Mes publications'),
                      ],
                    ),
                  ),
                ),
                Card(
                  child: InkWell(
                    onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (context) => BrouillonsWidget())),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Icon(Icons.drafts, size: 50),
                        Text('Mes brouillons'),
                      ],
                    ),
                  ),
                ),
                Card(
                  child: InkWell(
                    onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (context) => FavArticleWidget())),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Icon(Icons.favorite, size: 50),
                        Text('Mes Articles Favoris'),
                      ],
                    ),
                  ),
                ),
                Card(
                  child: InkWell(
                    onTap: () {
                      // Action pour Statistiques
                    },
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Icon(Icons.analytics, size: 50),
                        Text('Statistiques'),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Align(
              alignment: Alignment.bottomCenter,
              child: ElevatedButton(
                child: Text('Se déconnecter'),
                onPressed: () => logout(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
