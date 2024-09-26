import 'package:flutter/material.dart';
import '../models/article_input.dart';
import '../models/article.dart';
import '../services/Article_service.dart';

import 'package:lm3/src/bloc/user/user_bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ArticleEditPage extends StatefulWidget {
  const ArticleEditPage({Key? key, required this.article}) : super(key: key);
  final ArticleModel article;

  @override
  _ArticleEditPageState createState() => _ArticleEditPageState();
}

class _ArticleEditPageState extends State<ArticleEditPage> {

  late TextEditingController _titleController;
  late TextEditingController _contentController;
  late TextEditingController _topicController;

  bool _isTitleEditable = false;
  bool _isContentEditable = false;
  bool _isTopicEditable = false;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.article.title);
    _contentController = TextEditingController(text: widget.article.content);
    _topicController = TextEditingController(text: widget.article.topicId.toString());
  }

  void _updateArticle(BuildContext context) async {
    final article = ArticleInputModel(draft: false, 
                                      topic: _topicController.text as int, 
                                      title: _titleController.text, 
                                      subtitle: 'subtitle', 
                                      content: _contentController.text);
    try {
      final userBloc = BlocProvider.of<UserBloc>(context);
      await ArticleService(userBloc: userBloc).updateArticle(
        widget.article.id,
        article,
      );
      Navigator.of(context).pop();
    } catch (e) {
      print(e.toString());
    }
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Modifier l\'article'),
        actions: [
          IconButton(
            icon: Icon(Icons.save),
            onPressed: () => _updateArticle(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _titleController,
              decoration: InputDecoration(
                labelText: 'Titre',
                suffixIcon: IconButton(
                  icon: Icon(Icons.edit),
                  onPressed: () {
                    setState(() {
                      _isTitleEditable = true;
                    });
                  },
                ),
              ),
              readOnly: !_isTitleEditable,
              onSubmitted: (value) {
                setState(() {
                  _isTitleEditable = false;
                });
              },
              focusNode: FocusNode()..addListener(() {
                if (!_isTitleEditable) return;
                if (!FocusScope.of(context).hasFocus) {
                  setState(() {
                    _isTitleEditable = false;
                  });
                }
              }),
            ),

            TextField(
              controller: _topicController,
              decoration: InputDecoration(labelText: 'Thème'),
            ),
            TextField(
              controller: _contentController,
              decoration: InputDecoration(labelText: 'Contenu'),
              maxLines: null,
            ),
          ],
        ),
      ),
    );
  }
}
