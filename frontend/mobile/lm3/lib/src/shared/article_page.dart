import 'dart:math';

import 'package:flutter/material.dart';
import '../services/article_service.dart';
import '../models/article.dart'; // Assurez-vous que le chemin d'importation est correct
import '../router/router.dart';
import './article_edit.dart';

class ArticleDetailPage extends StatefulWidget {
  final ArticleModel article;

  ArticleDetailPage({required this.article});

  @override
  _ArticleDetailPageState createState() => _ArticleDetailPageState();
}

class _ArticleDetailPageState extends State<ArticleDetailPage> {
  final ArticleService _articleService = ArticleService();
  bool isFav = false;

  @override
  void initState() {
    super.initState();
    _checkIfArticleIsFav();
  }

  void _checkIfArticleIsFav() async {
    bool result = await _articleService.isFavArticle(widget.article.id);
    setState(() {
      isFav = result;
    });
  }

  void _fav() async {
    bool result = await _articleService.isFavArticle(widget.article.id);
    if (result) {
      setState(() {
        isFav = false;
      });
      widget.article.likes.removeLast();
      _articleService.unFavArticle(widget.article.id);
    } else {
      setState(() {
        isFav = true;
      });
      _articleService.favArticle(widget.article.id);
      widget.article.likes.add(1);
    }
  }

  void _publishArticle(BuildContext context) async {
    try {
      await _articleService.ChangeDraftState(widget.article.id, false);
    } catch (e) {
      print(e.toString());
    }
  }
  void _unPublishArticle(BuildContext context) async {
    try {
      await _articleService.ChangeDraftState(widget.article.id, true);
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
        title: Text(
          widget.article.topic.toUpperCase(),
          style: TextStyle(
            fontSize: 10,
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.close),
            onPressed: () => Navigator.of(context).pop(),
          ),
          if (widget.article.owner)
            IconButton(
              icon: Icon(Icons.settings),
              onPressed: () {
                // Logique pour ouvrir les paramètres
              },
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              widget.article.title,
              style: TextStyle(
                fontSize: 24.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8.0),
            Text(
              widget.article.authorName,
              style: TextStyle(
                fontSize: 18.0,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 8.0),
            Text(
              widget.article.createdAt.toLocal().toString(),
              style: TextStyle(
                fontSize: 16.0,
                color: Colors.grey,
              ),
            ),
            SizedBox(height: 16.0),
            Text(
              widget.article.content,
              style: TextStyle(
                fontSize: 16.0,
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomAppBar(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: <Widget>[
            if (widget.article.draft)
              ElevatedButton(
                child: Text('Publier'),
                onPressed: widget.article.owner ? () { 
                  _publishArticle(context);
                  Navigator.of(context).pop();
                } : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                )
            ),
            if (!widget.article.draft)
              ElevatedButton(
                child: Text('Partager'),
                onPressed: () {
                },
              ),
            GestureDetector(
              onTap: _fav, // Assurez-vous que la fonction _fav met à jour l'état de isFav correctement
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 18.0, vertical: 8.0),
                decoration: BoxDecoration(
                  color: Colors.red,
                  borderRadius: BorderRadius.circular(8.0),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    Icon(
                      this.isFav ? Icons.favorite : Icons.favorite_border,
                      size: 16.0,
                      color: Colors.white,
                    ),
                    SizedBox(width: 4.0),
                    Text(
                      '${widget.article.likes.length}',
                      style: const TextStyle(
                        fontSize: 12.0,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            if (widget.article.owner)
              PopupMenuButton<String>(
                onSelected: (String value) {
                  if (value == 'Modifier') {
                    Navigator.of(context).push(MaterialPageRoute(
                      builder: (context) => ArticleEditPage(article: widget.article),
                    ));
                  } else if (value == 'Supprimer') {
                    showDialog(
                      context: context,
                      builder: (BuildContext context) {
                        return AlertDialog(
                          title: Text("Confirmer la suppression"),
                          content: Text("Êtes-vous sûr de vouloir supprimer cet élément ?"),
                          actions: <Widget>[
                            TextButton(
                              child: Text("Annuler"),
                              onPressed: () {
                                Navigator.of(context).pop();
                              },
                            ),
                            TextButton (
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

    );
  }
}
