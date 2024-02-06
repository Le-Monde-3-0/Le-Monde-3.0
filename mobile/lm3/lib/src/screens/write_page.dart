import 'package:flutter/material.dart';

class WritePage extends StatefulWidget {
  const WritePage({super.key});
  @override
  _WritePageState createState() => _WritePageState();
}

class _WritePageState extends State<WritePage> {
  final _formKey = GlobalKey<FormState>();
  String? _articleTitle;
  String? _articleContent;

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      print('Titre de l\'article: $_articleTitle, Contenu de l\'article: $_articleContent');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Création d\'un Article'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              TextFormField(
                decoration: InputDecoration(labelText: 'Titre de l\'article'),
                validator: (value) => value!.isEmpty ? 'Ce champ est obligatoire' : null,
                onSaved: (value) => _articleTitle = value,
              ),
              Expanded(
                child: TextFormField(
                  decoration: InputDecoration(labelText: 'Contenu de l\'article'),
                  keyboardType: TextInputType.multiline,
                  maxLines: null, // Permet au champ de texte de s'étendre verticalement
                  validator: (value) => value!.isEmpty ? 'Ce champ est obligatoire' : null,
                  onSaved: (value) => _articleContent = value,
                ),
              ),
              ElevatedButton(
                onPressed: _submitForm,
                child: Text('Publier l\'Article'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}