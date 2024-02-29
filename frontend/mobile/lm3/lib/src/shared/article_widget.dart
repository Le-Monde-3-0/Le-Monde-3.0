import 'package:flutter/material.dart';
import '../models/article.dart';
import './article_page.dart'; // Assurez-vous que ce chemin d'importation est correct

class ArticleWidget extends StatelessWidget {
  final ArticleModel article;

  ArticleWidget({required this.article});

  String _truncateWithEllipsis(String text, int cutoff) {
    return (text.length <= cutoff) ? text : '${text.substring(0, cutoff)}...';
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => ArticleDetailPage(article: article),
          ),
        );
      },
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
        elevation: 4.0,
        margin: EdgeInsets.all(12.0),
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Expanded(
                    child: Text(
                      article.title,
                      style: TextStyle(
                        fontSize: 20.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      if (article.draft)
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 8.0, vertical: 2.0),
                          decoration: BoxDecoration(
                            color: Colors.grey,
                            borderRadius: BorderRadius.circular(8.0),
                          ),
                          child: Text(
                            'Draft',
                            style: TextStyle(
                              fontSize: 12.0,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      SizedBox(height: 4.0),
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 8.0, vertical: 2.0),
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(8.0),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: <Widget>[
                            Icon(
                              Icons.favorite, 
                              size: 16.0,
                              color: Colors.white,
                            ),
                            SizedBox(width: 4.0),
                            Text(
                              '${article.likes.length}',
                              style: TextStyle(
                                fontSize: 12.0,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  )
                ],
              ),
              SizedBox(height: 8.0),
              Text(
                article.authorName,
                style: TextStyle(
                  fontSize: 16.0,
                  color: Colors.grey[700],
                ),
              ),
              SizedBox(height: 8.0),
              Text(
                article.createdAt.toLocal().toString(),
                style: TextStyle(
                  fontSize: 14.0,
                  color: Colors.grey[500],
                ),
              ),
              SizedBox(height: 8.0),
              Text(
                _truncateWithEllipsis(article.content, 60),
                style: TextStyle(
                  fontSize: 16.0,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
