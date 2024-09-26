import 'package:flutter/material.dart';
import '../services/article_service.dart';
import '../models/article.dart';
import './article_edit.dart';

import 'package:lm3/src/bloc/user/user_bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ArticleDetailPage extends StatefulWidget {
  final ArticleModel article;

  const ArticleDetailPage({super.key, required this.article});

  @override
  _ArticleDetailPageState createState() => _ArticleDetailPageState();
}

class _ArticleDetailPageState extends State<ArticleDetailPage> {
  bool isFav = false;
  late final ArticleService _articleService;

  @override
  void initState() {
    super.initState();
    final userBloc = BlocProvider.of<UserBloc>(context);
    _articleService = ArticleService(userBloc: userBloc);
    _checkIfArticleIsFav();
  }

  void _checkIfArticleIsFav() async {
    bool result = await _articleService.isFavArticle(widget.article.id);
    setState(() {
      isFav = result;
    });
  }

  void _fav() async {
    _articleService.favArticle(widget.article.id, true);
    setState(() {
      widget.article.likeCounter++;
      isFav = !isFav;
    });
  }

  void _publishArticle(BuildContext context) async {
    try {
      await _articleService.ChangeDraftState(widget.article.id, widget.article, false);
    } catch (e) {
      print(e.toString());
    }
  }

  void _unPublishArticle(BuildContext context) async {
    try {
      await _articleService.ChangeDraftState(widget.article.id, widget.article, true);
    } catch (e) {
      print(e.toString());
    }
  }

  void _deleteArticle() async {
    try {
      _articleService.deleteArticle(widget.article.id);
    } catch (e) {
      print("Erreur lors de la suppression: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.article.topicId.toString()),
        actions: [
          IconButton(
            icon: Icon(Icons.close),
            onPressed: () => Navigator.of(context).pop(),
          ),
          if (widget.article.owner)
            IconButton(
              icon: Icon(Icons.settings),
              onPressed: () {
              },
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Text(
              widget.article.title,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 28.0,
              ),
            ),
            SizedBox(height: 8.0),
            Text(
              widget.article.authorId.toString(),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 8.0),
            Text(
              widget.article.createdAt.toLocal().toString().split(' ')[0],
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 16.0),
            Text(
              widget.article.content,
              textAlign: TextAlign.left,
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomAppBar(
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: <Widget>[
              if (widget.article.draft)
                ElevatedButton(
                  child: Text('Publier'),
                  onPressed: (widget.article.authorId == context.read<UserBloc>().state.user?.id)
                      ? () {
                          _publishArticle(context);
                          Navigator.of(context).pop();
                        }
                      : null,
                ),
              if (!widget.article.draft)
                ElevatedButton(
                  child: Text('Partager'),
                  onPressed: () {
                  },
                ),
              GestureDetector(
                onTap: _fav,
                child: Row(
                  children: <Widget>[
                    Icon(
                      this.isFav ? Icons.favorite : Icons.favorite_border,
                      size: 24.0,
                    ),
                    SizedBox(width: 4.0),
                    Text('${widget.article.likeCounter}'),
                  ],
                ),
              ),
              Row(
                children: <Widget>[
                  Icon(Icons.visibility, size: 24.0),
                  SizedBox(width: 4.0),
                  Text('${widget.article.viewCounter}'),
                ],
              ),
              if (widget.article.authorId == context.read<UserBloc>().state.user?.id)
                PopupMenuButton<String>(
                  onSelected: (String value) {
                    if (value == 'Modifier') {
                      Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) => ArticleEditPage(article: widget.article),
                      ));
                    } else if (value == 'Supprimer') {
                      _showDeleteDialog(context);
                    } else if (value == 'unPublish') {
                      _unPublishArticle(context);
                      Navigator.of(context).pop();
                    }
                  },
                  itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
                    const PopupMenuItem<String>(
                      value: 'Modifier',
                      child: Text('Modifier'),
                    ),
                    const PopupMenuItem<String>(
                      value: 'Supprimer',
                      child: Text('Supprimer'),
                    ),
                    const PopupMenuItem<String>(
                      value: 'unPublish',
                      child: Text('Mettre en brouillon'),
                    ),
                  ],
                  icon: Icon(Icons.more_vert),
                ),
            ],
          ),
        ),
      ),
    );
  }

  void _showDeleteDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Confirmer la suppression"),
          content: Text("Êtes-vous sûr de vouloir supprimer cet article ?"),
          actions: <Widget>[
            TextButton(
              child: Text("Annuler"),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text("Supprimer"),
              onPressed: () {
                _deleteArticle();
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }
}
