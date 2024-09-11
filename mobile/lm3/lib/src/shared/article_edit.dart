import 'package:flutter/material.dart';
import '../models/article.dart';
import '../services/Article_service.dart';

class ArticleEditPage extends StatefulWidget {
  final ArticleModel article;

  const ArticleEditPage({Key? key, required this.article}) : super(key: key);

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
    _topicController = TextEditingController(text: widget.article.topic);
  }

  void _updateArticle(BuildContext context) async {
    try {
      await ArticleService().updateArticle(
        widget.article.id,
        _contentController.text,
        'subtsile',
        _titleController.text,
        _topicController.text,
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
