import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'package:lm3/src/router/router.dart';
import 'package:lm3/src/bloc/user/user_bloc.dart';
import 'package:lm3/src/bloc/user/user_state.dart';

import 'package:lm3/src/widgets/switch_account.dart';
import 'package:lm3/src/services/Profile_service.dart';

class ParametersPage extends StatefulWidget {
  const ParametersPage({super.key});

  @override
  State<ParametersPage> createState() => _ParametersPageState();
}

class _ParametersPageState extends State<ParametersPage> {
  final storage = FlutterSecureStorage();
  late final ProfileService _profileService;

  @override
  void initState() {
    super.initState();
    final userBloc = BlocProvider.of<UserBloc>(context);
    _profileService = ProfileService(userBloc: userBloc);
  }

  void checkLoginStatus(BuildContext context) async {
    String? user = await storage.read(key: 'user');
    if (user == null || user.isEmpty) {
      print('user not found in secure storage');
      AuthRoute().go(context);
    }
  }

  void logout(BuildContext context) async {
    await storage.delete(key: 'user');
    AuthRoute().go(context);
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
                const Padding(
                  padding: EdgeInsets.all(10.0),
                  child: AccountSelectorWidget()
                ),
                _buildProfileButton(
                  context, 
                  icon: Icons.person, 
                  text: 'Modifier le nom d\'utilisateur', 
                  onTap: () => _changeUsernameDialog(context)
                ),
                _buildProfileButton(
                  context, 
                  icon: Icons.email, 
                  text: 'Modifier l\'email', 
                  onTap: () => _changeEmailDialog(context)
                ),
                _buildProfileButton(
                  context, 
                  icon: Icons.lock, 
                  text: 'Modifier le mot de passe', 
                  onTap: () => _changePasswordDialog(context)
                ),
                Padding(
                  padding: const EdgeInsets.all(10.0),
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

  void _changeUsernameDialog(BuildContext context) {
    TextEditingController usernameController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Changer le nom d\'utilisateur'),
          content: TextField(
            controller: usernameController,
            decoration: InputDecoration(hintText: 'Nouveau nom d\'utilisateur'),
          ),
          actions: [
            TextButton(
              child: Text('Annuler'),
              onPressed: () => Navigator.of(context).pop(),
            ),
            TextButton(
              child: Text('Enregistrer'),
              onPressed: () async {
                String newUsername = usernameController.text.trim();
                if (newUsername.isNotEmpty) {
                  await _profileService.changeUsername(newUsername);
                  setState(() {});
                  Navigator.of(context).pop();
                }
              },
            ),
          ],
        );
      },
    );
  }

  void _changeEmailDialog(BuildContext context) {
    TextEditingController emailController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Changer l\'email'),
          content: TextField(
            controller: emailController,
            decoration: InputDecoration(hintText: 'Nouvel email'),
          ),
          actions: [
            TextButton(
              child: Text('Annuler'),
              onPressed: () => Navigator.of(context).pop(),
            ),
            TextButton(
              child: Text('Enregistrer'),
              onPressed: () async {
                String newEmail = emailController.text.trim();
                if (newEmail.isNotEmpty) {
                  await _profileService.changeEmail(newEmail);
                  setState(() {});
                  Navigator.of(context).pop();
                }
              },
            ),
          ],
        );
      },
    );
  }

  void _changePasswordDialog(BuildContext context) {
    TextEditingController oldPasswordController = TextEditingController();
    TextEditingController newPasswordController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Changer le mot de passe'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: oldPasswordController,
                decoration: InputDecoration(hintText: 'Ancien mot de passe'),
                obscureText: true,
              ),
              TextField(
                controller: newPasswordController,
                decoration: InputDecoration(hintText: 'Nouveau mot de passe'),
                obscureText: true,
              ),
            ],
          ),
          actions: [
            TextButton(
              child: Text('Annuler'),
              onPressed: () => Navigator.of(context).pop(),
            ),
            TextButton(
              child: Text('Enregistrer'),
              onPressed: () async {
                String oldPassword = oldPasswordController.text.trim();
                String newPassword = newPasswordController.text.trim();
                if (oldPassword.isNotEmpty && newPassword.isNotEmpty) {
                  await _profileService.changePassword(oldPassword, newPassword);
                  setState(() {});
                  Navigator.of(context).pop();
                }
              },
            ),
          ],
        );
      },
    );
  }
}
