import 'package:flutter/material.dart';
import '../models/article.dart';
import './article_page.dart';

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
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16.0)),
        elevation: 4.0,
        margin: EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                article.title,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(fontSize: 22.0),
              ),
              SizedBox(height: 16.0),
              Text(
                _truncateWithEllipsis(article.content, 100),
              ),
              SizedBox(height: 16.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.calendar_today, size: 16.0),
                      SizedBox(width: 4.0),
                      Text(article.createdAt.toLocal().toString().split(' ')[0]),
                    ],
                  ),
                  _buildIconWithText(icon: Icons.favorite_border, text: '${article.likeCounter}'),
                  _buildIconWithText(icon: Icons.visibility_outlined, text: '${article.viewCounter}'),
                  Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: Colors.grey[300],
                        radius: 12.0,
                        child: Icon(Icons.person, size: 16.0),
                      ),
                      SizedBox(width: 8.0),
                      Text('${article.authorId}'),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildIconWithText({required IconData icon, required String text}) {
    return Row(
      children: [
        Icon(icon, size: 18.0),
        SizedBox(width: 4.0),
        Text(text),
      ],
    );
  }
}
