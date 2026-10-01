import { NextRequest, NextResponse } from 'next/server';

// Fetch a paginated list of LeetCode problems using the public GraphQL API
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { skip = 0, limit = 50, difficulty = '', tags = [], searchKeyword = '' } = body;

    const query = `
      query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
          categorySlug: $categorySlug
          limit: $limit
          skip: $skip
          filters: $filters
        ) {
          total: totalNum
          questions: data {
            acRate
            difficulty
            freqBar
            frontendQuestionId: questionFrontendId
            isFavor
            isPaidOnly
            status
            title
            titleSlug
            topicTags {
              name
              id
              slug
            }
            hasSolution
            hasVideoSolution
          }
        }
      }
    `;

    const filters: any = {};
    if (difficulty) filters.difficulty = difficulty.toUpperCase();
    if (searchKeyword) filters.searchKeywords = searchKeyword;
    if (tags.length > 0) filters.tags = tags;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: 'https://leetcode.com/problemset/',
      },
      body: JSON.stringify({
        query,
        variables: {
          categorySlug: 'all-code-essentials',
          limit,
          skip,
          filters,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`LeetCode API returned ${response.status}`);
    }

    const data = await response.json();
    const list = data?.data?.problemsetQuestionList;

    if (!list) {
      throw new Error('No data returned from LeetCode');
    }

    return NextResponse.json({
      total: list.total,
      questions: list.questions,
    });
  } catch (err: any) {
    console.error('[leetcode/problems-list] error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch problems list' }, { status: 500 });
  }
}
