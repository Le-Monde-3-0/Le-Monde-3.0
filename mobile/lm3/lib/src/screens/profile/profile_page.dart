import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

//BLOC
import 'package:lm3/src/router/router.dart';
import 'package:lm3/src/bloc/user/user_bloc.dart';
import 'package:lm3/src/bloc/user/user_state.dart';

import 'package:lm3/src/widgets/switch_account.dart';

import 'user_draft_page.dart';
import 'user_published_page.dart';
import 'user_liked_article_page.dart';
import 'user_article_page.dart';
import 'user_parameters_page.dart';

import 'package:lm3/src/services/Profile_service.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final storage = FlutterSecureStorage();
  late final ProfileService _articleService;

  @override
  void initState() {
    super.initState();
    final userBloc = BlocProvider.of<UserBloc>(context);
    _articleService = ProfileService(userBloc: userBloc);
  }
  void checkLoginStatus(BuildContext context) async {
    String? user = await storage.read(key: 'user');
    if (user == null || user.isEmpty) {
      print('user not found in secure storage');
      AuthRoute().go(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    checkLoginStatus(context);
    return Scaffold(
      body: Column(
        children: [
          BlocBuilder<UserBloc, UserState>(
            builder: (context, state) {
              if (state is UserLoaded) {
                return Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 30,
                        child: Icon(Icons.person, size: 40),
                      ),
                      SizedBox(width: 16),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            state.user.username,
                            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            state.user.email,
                            style: TextStyle(fontSize: 16, color: Colors.grey),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              } else if (state is UserLoading) {
                return Center(child: CircularProgressIndicator());
              } else {
                return Center(child: Text('Erreur lors du chargement des informations utilisateur'));
              }
            },
          ),
          Expanded(
            child: ListView(
              children: [
                _buildProfileButton(
                  context,
                  icon: Icons.analytics,
                  text: 'Mes articles',
                  onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (context) => PublishedWidget())),
                ),
                _buildProfileButton(
                  context,
                  icon: Icons.favorite,
                  text: 'Mes articles favoris',
                  onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (context) => FavArticleWidget())),
                ),
                _buildProfileButton(
                  context,
                  icon: Icons.analytics,
                  text: 'Statistiques',
                  onTap: () {
                  },
                ),
                _buildProfileButton(
                  context,
                  icon: Icons.settings,
                  text: 'parametres',
                  onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (context) => ParametersPage())),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileButton(BuildContext context, {required IconData icon, required String text, required VoidCallback onTap}) {
    return Card(
      margin: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: ListTile(
        leading: Icon(icon, size: 40),
        title: Text(text),
        onTap: onTap,
      ),
    );
  }
}