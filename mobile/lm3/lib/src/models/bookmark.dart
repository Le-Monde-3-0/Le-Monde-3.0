
import 'package:lm3/src/models/article.dart';
class Bookmark {
  final int? id;
  final int? userId;
  final String? title;
  final String? description;
  final List<int>? articles;

  Bookmark({this.id, this.userId, this.title, this.description, this.articles});

  factory Bookmark.fromJson(Map<String, dynamic> json) {
    return Bookmark(
      id: json['Id'],
      userId: json['UserId'],
      title: json['Title'],
      description: json['Description'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'Id': id,
      'UserId': userId,
      'Title': title,
      'Description': description,
    };
  }
}

class Articleinbookmark extends ArticleModel {
  Articleinbookmark({
    required int id,
    required String title,
    required String content,
    required DateTime createdAt,
    required DateTime updatedAt,
    required int userId,
    required String authorName,
    required String subtitle,
    required String topic,

    required bool draft,

    int ?likes,
  }) : super(
          id: id,
          title: title,
          content: content,
          createdAt: createdAt,
          updatedAt: updatedAt,
          userId: userId,
          authorName: authorName,
          subtitle: subtitle,
          topic: topic,
          draft: draft,
          likes: likes != null ? [likes] : [],
        );

factory Articleinbookmark.fromJson(Map<String, dynamic> json) {
  print("JSON data: $json");
  return Articleinbookmark(
    id: json['Id'],
    title: json['Title']?? '',
    content: json['Content'],
    createdAt: DateTime.parse(json['CreatedAt']),
    updatedAt: DateTime.parse(json['UpdatedAt']),
    userId: json['UserId'] ?? 0,
    authorName: json['AuthorName'] ?? '',
    subtitle: json['Subtitle'] ?? '',
    topic: json['Topic'] ?? '',
    draft: json['Draft'] ?? false,
    likes: json['Likes'] ?? 0,
  );
}


}