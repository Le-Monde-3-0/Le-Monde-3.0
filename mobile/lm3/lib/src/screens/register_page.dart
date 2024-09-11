import 'package:flutter/material.dart';
import 'auth_page.dart';
import '../services/Auth_service.dart';

class CreateProfilePage extends StatefulWidget {
  @override
  _CreateProfilePageState createState() => _CreateProfilePageState();
}

class _CreateProfilePageState extends State<CreateProfilePage> {
  final _formKey = GlobalKey<FormState>();
  String? _name;
  String? _email;
  String? _password;
  UserService _userService = UserService();

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      _createAccount();
    }
  }

  Future<void> _createAccount() async {
    var response = await _userService.createUser(_email!, _name!, _password!);
    if (response.statusCode == 201) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (context) => AuthPage()),
          (Route<dynamic> route) => false,
        ); } else {
        print('Failed to create an account: ${response.body}');
      } 
    if (response.statusCode == 400) {
        print('Failed to create an account: ${response.body}');
      }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Créer un Compte'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              TextFormField(
                decoration: InputDecoration(labelText: 'Nom d\'utilisateur'),
                validator: (value) => value!.isEmpty ? 'Ce champ est obligatoire' : null,
                onSaved: (value) => _name = value,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Adresse Email'),
                validator: (value) => !value!.contains('@') ? 'Email invalide' : null,
                onSaved: (value) => _email = value,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Mot de Passe'),
                obscureText: true,
                validator: (value) => value!.length < 6 ? 'Mot de passe trop court' : null,
                onSaved: (value) => _password = value,
              ),
              ElevatedButton(
                onPressed: _submitForm,
                child: Text('Créer mon compte'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
