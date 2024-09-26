import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../shared/article_page_previsual.dart';
import '../models/article_input.dart';

import 'package:lm3/src/services/topic_service.dart';
import 'package:lm3/src/models/topic.dart';

//BLOC
import 'package:lm3/src/bloc/user/user_bloc.dart';
import 'package:lm3/src/bloc/user/user_state.dart';

class WritePage extends StatefulWidget {
  const WritePage({super.key});
  @override
  _WritePageState createState() => _WritePageState();
}

class _WritePageState extends State<WritePage> {
  final _formKey = GlobalKey<FormState>();
  final storage = new FlutterSecureStorage();
  late final TopicService _topicService;

  final _articleTitle = TextEditingController();
  int? _selectedTopicId;
  final _articleContent = TextEditingController();
  late Future<List<TopicModel>> _topics;

  @override
  void initState() {
    super.initState();
    final userBloc = BlocProvider.of<UserBloc>(context);
    _topicService = TopicService(userBloc: userBloc);
    _topics = _topicService.getTopics();
  }  

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
                    labelStyle: const TextStyle(color: Color.fromARGB(255, 0, 0, 0)),
                    fillColor: Colors.white, 
                    filled: true,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8.0),
                    ),
                  ),
                  validator: (value) => value!.isEmpty ? 'Ce champ est obligatoire' : null,
                  controller: _articleTitle,
                ),
                SizedBox(height: 16.0),

                FutureBuilder<List<TopicModel>>(
                  future: _topics,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return Center(child: CircularProgressIndicator());
                    } else if (snapshot.hasError) {
                      return Text('Erreur: ${snapshot.error}');
                    } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                      return Text('Aucun thème disponible');
                    } else {
                      List<TopicModel> topics = snapshot.data!;

                      return DropdownButtonFormField<int>(
                        decoration: InputDecoration(
                          labelText: 'Sélectionnez un thème',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8.0),
                          ),
                        ),
                        items: topics.map((TopicModel topic) {
                          return DropdownMenuItem<int>(
                            value: topic.id,
                            child: Text(topic.name),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() {
                            _selectedTopicId = value;
                          });
                        },
                        validator: (value) => value == null ? 'Sélectionnez un thème' : null,
                      );
                    }
                  },
                ),

                const SizedBox(height: 16.0),

                ConstrainedBox(
                  constraints: BoxConstraints(
                    minHeight: screenHeight / 2,
                  ),
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8.0),
                    child: TextFormField(
                      decoration: InputDecoration(
                        labelText: 'Contenu de l\'article',
                        labelStyle: const TextStyle(color: Color.fromARGB(255, 0, 0, 0)),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8.0),
                        ),
                        fillColor: Colors.white,
                        filled: true,
                      ),
                      keyboardType: TextInputType.multiline,
                      maxLines: null,
                      validator: (value) => value!.isEmpty ? 'Ce champ est obligatoire' : null,
                      controller: _articleContent,
                    ),
                  ),
                ),

                ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      var article = ArticleInputModel(
                        draft: false,
                        topic: _selectedTopicId!,
                        title: _articleTitle.text,
                        subtitle: "subtile",
                        content: _articleContent.text,
                      );
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => ArticleDetailPrevisuPage(article: article),
                        ),
                      );
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color.fromARGB(255, 112, 243, 121),
                    foregroundColor: Colors.white,
                    shape: CircleBorder(),
                    padding: EdgeInsets.all(20),
                  ),
                  child: Icon(Icons.arrow_forward),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
