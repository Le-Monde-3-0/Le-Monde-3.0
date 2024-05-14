import 'package:flutter/material.dart';
import '../shared/article_page_previsual.dart';
import '../models/article.dart';

class WritePage extends StatefulWidget {
  const WritePage({super.key});
  @override
  _WritePageState createState() => _WritePageState();
}

class _WritePageState extends State<WritePage> {
  final _formKey = GlobalKey<FormState>();

  final _articleTitle = TextEditingController();
  final _articleTheme = TextEditingController();
  final _articleContent = TextEditingController();
  
  @override
  Widget build(BuildContext context) {
    double screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Création d\'un Article'),
      ),
      body: SingleChildScrollView( 
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                TextFormField(
                  decoration: InputDecoration(
                    labelText: 'Titre de l\'article',
                    labelStyle: const TextStyle(color: const Color.fromARGB(255, 0, 0, 0)),
                    fillColor: Colors.white, 
                    filled: true,
                    border: OutlineInputBorder( 
                      borderRadius: BorderRadius.circular(8.0),
                      borderSide: const BorderSide(color: const Color.fromARGB(255, 0, 0, 0)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8.0),
                      borderSide: const BorderSide(color: const Color.fromARGB(255, 0, 0, 0), width: 2.0),
                    ),
                    errorBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8.0),
                      borderSide: const BorderSide(color: const Color.fromARGB(255, 0, 0, 0), width: 2.0),
                    ),
                    prefixIcon: const Icon(Icons.title, color: const Color.fromARGB(255, 0, 0, 0)), 
                    suffixIcon: const Icon(Icons.edit, color: const Color.fromARGB(255, 0, 0, 0)),
                  ),
                  validator: (value) => value!.isEmpty ? 'Ce champ est obligatoire' : null,
                  controller: _articleTitle,
                  style: const TextStyle(
                    color:const Color.fromARGB(255, 0, 0, 0),
                  ),
                ),
                SizedBox(height: 16.0),
                TextFormField(
                  decoration: InputDecoration(
                    labelText: 'Theme de l\'article',
                    labelStyle: const TextStyle(color: const Color.fromARGB(255, 0, 0, 0)),
                    fillColor: Colors.white, 
                    filled: true,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8.0),
                      borderSide: const BorderSide(color: const Color.fromARGB(255, 0, 0, 0)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8.0),
                      borderSide: const BorderSide(color: const Color.fromARGB(255, 0, 0, 0), width: 2.0),
                    ),
                    errorBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8.0),
                      borderSide: const BorderSide(color: const Color.fromARGB(255, 0, 0, 0), width: 2.0),
                    ),
                    prefixIcon: const Icon(Icons.title, color: const Color.fromARGB(255, 0, 0, 0)),
                    suffixIcon: const Icon(Icons.edit, color: const Color.fromARGB(255, 0, 0, 0)),
                  ),
                  validator: (value) => value!.isEmpty ? 'Ce champ est obligatoire' : null,
                  controller: _articleTheme,
                  style: TextStyle(
                    color: const Color.fromARGB(255, 0, 0, 0),
                  ),
                ), 
                const SizedBox(height: 16.0),
                ConstrainedBox(
                  constraints: BoxConstraints(
                    minHeight: screenHeight / 2,
                  ),
                  child: Container(
                    child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8.0),
                      child: TextFormField(
                        decoration: InputDecoration(
                          labelText: 'Contenu de l\'article',
                          labelStyle: const TextStyle(color: const Color.fromARGB(255, 0, 0, 0)),
                          enabledBorder: OutlineInputBorder(
                            borderSide: const BorderSide(color: const Color.fromARGB(255, 0, 0, 0), width: 1.0),
                            borderRadius: BorderRadius.circular(8.0),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderSide: const BorderSide(color: Color.fromARGB(255, 0, 0, 0), width: 2.0),

                            borderRadius: BorderRadius.circular(8.0),
                          ),
                          fillColor: Colors.white,
                          filled: true,
                        ),
                        keyboardType: TextInputType.multiline,
                        maxLines: null,
                        validator: (value) => value!.isEmpty ? 'Ce champ est obligatoire' : null,
                        controller: _articleContent,
                        style: TextStyle(
                          color: const Color.fromARGB(255, 0, 0, 0),
                        ),
                      ),
                    ),
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      var article = ArticleModel(
                        id: 1,
                        createdAt: DateTime.now(),
                        updatedAt: DateTime.now(),
                        userId: 1,
                        authorName: "moi",
                        title: _articleTitle.text,
                        subtitle: "subtile",
                        content: _articleContent.text,
                        topic: _articleTheme.text,
                        draft: false,
                        likes: [],
                      );
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => ArticleDetailPrevisuPage(article: article),
                        ),
                      );
                    }
                  },
                  icon: Icon(Icons.arrow_forward),
                  label: const Text('Suivant'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color.fromARGB(255, 112, 243, 121),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                    textStyle: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}