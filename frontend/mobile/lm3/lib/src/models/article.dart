class ArticleModel {
  final int id;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int userId;
  final String authorName;
  final String title;
  final String subtitle;
  final String content;
  final String topic;
  final bool draft;
  final List<dynamic> likes;
  bool owner;

  ArticleModel({
    required this.id,
    required this.createdAt,
    required this.updatedAt,
    required this.userId,
    required this.authorName,
    required this.title,
    required this.subtitle,
    required this.content,
    required this.topic,
    required this.draft,
    required this.likes,
    this.owner = false,
  });

  factory ArticleModel.fromJson(Map<String, dynamic> json, [bool owner = false]) {
    return ArticleModel(
      id: json['Id'] as int,
      createdAt: DateTime.parse(json['CreatedAt']),
      updatedAt: DateTime.parse(json['UpdatedAt']),
      userId: json['UserId'] as int,
      authorName: json['AuthorName'] as String,
      title: json['Title'] as String,
      subtitle: json['Subtitle'] as String,
      content: json['Content'] as String,
      topic: json['Topic'] as String,
      draft: json['Draft'] as bool,
      likes: List<dynamic>.from(json['Likes']),
      owner: owner,
    );
  }

  factory ArticleModel.fromMap(Map<String, dynamic> map,  [bool owner = false]) {
    return ArticleModel(
      id: map['Id'] as int,
      createdAt: DateTime.parse(map['CreatedAt']),
      updatedAt: DateTime.parse(map['UpdatedAt']),
      userId: map['UserId'] as int,
      authorName: map['AuthorName'] as String,
      title: map['Title'] as String,
      subtitle: map['Subtitle'] as String,
      content: map['Content'] as String,
      topic: map['Topic'] as String,
      draft: map['Draft'] as bool,
      likes: List<dynamic>.from(map['Likes']),
      owner: owner,
    );
  }
}
